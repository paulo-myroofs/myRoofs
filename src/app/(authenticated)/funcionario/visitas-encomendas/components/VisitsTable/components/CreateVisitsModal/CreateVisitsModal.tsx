import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Timestamp } from "firebase/firestore";
import Image from "next/image";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { inputClassName } from "@/app/contants";
import { EmployeeEntity } from "@/common/entities/employee";
import { VisitEntity } from "@/common/entities/visits";
import Button from "@/components/atoms/Button/button";
import { DatePicker } from "@/components/atoms/DatePicker/DatePicker";
import FormErrorLabel from "@/components/atoms/FormError/formError";
import Label from "@/components/atoms/Label/label";
import TransitionModal from "@/components/atoms/TransitionModal/tempModal";
import InputField from "@/components/molecules/InputField/inputField";
import SelectField from "@/components/molecules/SelectField/selectField";
import useCondo from "@/hooks/queries/condos/useCondo";
import useResidentsByCondoId from "@/hooks/queries/residents/useResidentsByCondoId";
import useProfile from "@/hooks/queries/useProfile";
import { errorToast, successToast } from "@/hooks/useAppToast";
import useAuth from "@/hooks/useAuth";
import { queryClient } from "@/store/providers/queryClient";
import {
  createFirestoreDoc,
  deleteFirestoreDoc,
  updateFirestoreDoc
} from "@/store/services";
import { sendNotification } from "@/store/services/notification";
import { sendBrSms } from "@/store/services/sms";
import formatToPhoneMask from "@/utils/formatToPhoneMask";
import removeDuplicates from "@/utils/removeDuplicates";
import { timestampToDate } from "@/utils/timestampToDate";
import unmask from "@/utils/unmask";
import AddVisitSchema from "@/validations/employee/AddVisit";

import { CreateVisitsModalProps } from "./types";

function getRandomLetters(id: string) {
  let result = "";
  const idArray = id.split("");
  for (let i = 0; i < 4; i++) {
    const randomIndex = Math.floor(Math.random() * idArray.length);
    result += idArray.splice(randomIndex, 1);
  }
  return result;
}

type AddVisitForm = z.infer<typeof AddVisitSchema>;

const CreateVisitsModal = ({
  isOpen,
  onOpenChange,
  visitData
}: CreateVisitsModalProps) => {
  const { userUid } = useAuth();
  const { data: user } = useProfile<EmployeeEntity>(userUid);
  const condoId = user?.condominiumCode as string;
  const { data: condo } = useCondo(condoId);
  const { data: residents } = useResidentsByCondoId(condoId as string);
  const [loading, setLoading] = useState(false);
  const formationOptions =
    condo?.formationNames.map((item) => ({
      label: item,
      value: item.toLocaleLowerCase()
    })) ?? [];

  const categoryOptions = [
    { label: "Visita", value: "visita" },
    { label: "Serviço", value: "serviço" }
  ];

  const {
    handleSubmit,
    register,
    control,
    watch,
    formState: { errors },
    reset
  } = useForm<AddVisitForm>({
    mode: "all",
    criteriaMode: "all",
    resolver: zodResolver(AddVisitSchema),
    defaultValues: {
      name: visitData?.name ?? "",
      phone: visitData?.phone ? formatToPhoneMask(visitData.phone) : "",
      category:
        (visitData?.visitType?.toLowerCase() as "visita" | "serviço") ?? "",
      date: visitData?.date ? timestampToDate(visitData?.date) : new Date(),
      formation:
        formationOptions.find((i) => i.label === visitData?.formation)?.value ??
        "",
      apartment: visitData?.apartment ?? "",
      resident:
        residents
          ?.find((item) => item.id === visitData?.residentId)
          ?.name?.toLowerCase() ?? ""
    }
  });

  const apartmentOptions =
    removeDuplicates(
      residents
        ?.filter((item) =>
          watch("formation")
            ? watch("formation") === item.formationName.toLowerCase()
            : true
        )
        ?.map((item) => item.housingName) ?? []
    )?.map((item) => ({
      label: item,
      value: item?.toLocaleLowerCase()
    })) ?? [];

  const residentsOptions =
    residents
      ?.filter((item) =>
        watch("formation")
          ? item.formationName.toLocaleLowerCase() === watch("formation")
          : true
      )
      ?.filter((item) =>
        watch("apartment") ? item.housingName === watch("apartment") : true
      )
      ?.map((item) => ({
        label: item.name,
        value: item.name?.toLocaleLowerCase()
      })) ?? [];

  const handleForm = async (data: AddVisitForm) => {
    if (!condoId) return;

    setLoading(true);

    const finalData: Omit<
      VisitEntity,
      "id" | "createdAt" | "createdBy" | "validationCode" | "wasValidated"
    > = {
      name: data.name,
      phone: unmask(data.phone),
      visitType: categoryOptions.find((v) => v.value === data.category)
        ?.label as string,
      date: Timestamp.fromDate(data.date),
      formation: formationOptions.find((v) => v.value === data.formation)
        ?.label as string,
      apartment: data.apartment,
      condominiumId: condoId
    };

    if (!visitData) {
      const resident = residents?.find(
        (item) =>
          item.name.toLocaleLowerCase() === data.resident.toLocaleLowerCase()
      );
      const generatedCode = getRandomLetters(resident?.id ?? "");
      await createFirestoreDoc<Omit<VisitEntity, "id">>({
        collectionPath: `visits`,
        data: {
          wasValidated: false,
          ...finalData,
          createdBy: userUid,
          createdAt: Timestamp.now(),
          validationCode: generatedCode,
          residentId: resident?.id ?? ""
        }
      });
      successToast("Nova visita adicionada.");

      await sendNotification({
        content: "Aviso: Foi criado um novo visitante pra você",
        title: "Aviso!",
        date: null,
        type: "visitor",
        users: [
          {
            tokens: resident?.tokens ?? [],
            userId: resident?.id ?? ""
          }
        ]
      });

      const { error } = await sendBrSms({
        to: unmask(data.phone),
        text: `O código que você precisa pra acessar myroofs é ${generatedCode}`
      });
      if (error) {
        errorToast("Algo deu errado ao mandar o SMS");
      }
    } else {
      await updateFirestoreDoc({
        documentPath: `/visits/${visitData.id}`,
        data: finalData
      });
      queryClient.invalidateQueries(["visits", condoId]);
      successToast("Visita editada com sucesso!");
    }

    setLoading(false);
    queryClient.invalidateQueries(["visits", condoId]);
    reset();
    onOpenChange(false);
  };

  const handleDelete = async () => {
    if (!visitData) return;
    setLoading(true);
    await deleteFirestoreDoc({
      documentPath: `/visits/${visitData.id}`
    });
    setLoading(false);
    successToast("Visita excluída com sucesso.");
    queryClient.invalidateQueries(["visits", condoId]);
    onOpenChange(false);
  };

  const handleClose = () => {
    reset();
    onOpenChange(false);
  };

  return (
    <TransitionModal
      isOpen={isOpen}
      onOpenChange={handleClose}
      title="Registro de visitante"
      description="Insira as informações necessárias para registrar o visitante"
      confirmBtn={
        <Button
          variant="icon"
          size="lg"
          className="w-[210px] bg-[#202425]"
          loading={loading}
          onClick={handleSubmit(handleForm)}
        >
          {visitData ? "Editar " : "Registrar"}
        </Button>
      }
      cancelBtn={
        <Button
          onClick={handleClose}
          type="button"
          variant="outline-black"
          size="lg"
          className="w-[210px] text-sm"
        >
          Cancelar
        </Button>
      }
    >
      {visitData && (
        <button
          type="button"
          onClick={handleDelete}
          className="absolute top-5 right-5 transition-all hover:scale-110"
        >
          <Image
            src={"/icons/commonArea/trash.svg"}
            width={30}
            height={30}
            alt="Icon de remoção"
          />
        </button>
      )}
      <form
        onSubmit={handleSubmit(handleForm)}
        className={`flex flex-col gap-y-4`}
      >
        <div className={"flex flex-col gap-1"}>
          <Label>Data</Label>
          <Controller
            name={"date"}
            control={control}
            render={({ field }) => (
              <DatePicker
                date={field.value}
                setDate={(value) => field.onChange(value)}
              />
            )}
          />
          {errors.date && errors.date.message && (
            <FormErrorLabel>{errors.date.message.toString()}</FormErrorLabel>
          )}
        </div>

        <InputField
          formErrors={errors}
          name="name"
          className={inputClassName}
          label="Name"
          register={register}
          placeholder="Digite aqui"
        />
        <div className="grid grid-cols-2 gap-x-2">
          <InputField
            formErrors={errors}
            name="phone"
            mask="(99) 99999-9999"
            className={inputClassName}
            label="Telefone"
            register={register}
            placeholder="Digite aqui"
          />

          <SelectField
            options={categoryOptions}
            formErrors={errors}
            name="category"
            className={inputClassName}
            label="Categoria"
            control={control}
            placeholder="Digite aqui"
          />
        </div>

        <div className="grid grid-cols-2 gap-x-2">
          <SelectField
            options={formationOptions}
            formErrors={errors}
            name="formation"
            className={inputClassName}
            label="Formação"
            control={control}
            placeholder="Digite formação"
          />
          <SelectField
            options={watch("formation") ? apartmentOptions : []}
            formErrors={errors}
            name="apartment"
            className={inputClassName}
            label="Apartamento"
            control={control}
            placeholder="Digite apartamento"
          />
        </div>

        <SelectField
          options={watch("apartment") ? residentsOptions : []}
          formErrors={errors}
          name="resident"
          className={inputClassName}
          label="Morador"
          control={control}
          placeholder="Digite morador"
        />
      </form>
    </TransitionModal>
  );
};

export default CreateVisitsModal;
