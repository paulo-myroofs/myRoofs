import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Timestamp } from "firebase/firestore";
import Image from "next/image";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { inputClassName } from "@/app/contants";
// import { EmployeeEntity } from "@/common/entities/employee";
import { OrderEntity, OrderType } from "@/common/entities/order";
import Button from "@/components/atoms/Button/button";
import { DatePicker } from "@/components/atoms/DatePicker/DatePicker";
import FormErrorLabel from "@/components/atoms/FormError/formError";
import Label from "@/components/atoms/Label/label";
import TransitionModal from "@/components/atoms/TransitionModal/tempModal";
import SelectField from "@/components/molecules/SelectField/selectField";
import useCondo from "@/hooks/queries/condos/useCondo";
import useResidentsByCondoId from "@/hooks/queries/residents/useResidentsByCondoId";
// import useProfile from "@/hooks/queries/useProfile";
import { errorToast, successToast } from "@/hooks/useAppToast";
import useAuth from "@/hooks/useAuth";
import { queryClient } from "@/store/providers/queryClient";
import {
  createFirestoreDoc,
  deleteFirestoreDoc,
  updateFirestoreDoc
} from "@/store/services";
import { sendNotification } from "@/store/services/notification";
import { storageGet } from "@/store/services/storage";
import removeDuplicates from "@/utils/removeDuplicates";
import { timestampToDate } from "@/utils/timestampToDate";
import AddOrderSchema from "@/validations/employee/AddOrder";
import InputField from "@molecules/InputField/inputField";

import { CreateOrderModalProps } from "./types";

type AddOrderForm = z.infer<typeof AddOrderSchema>;

const CreateOrderModal = ({
  isOpen,
  onOpenChange,
  orderData
}: CreateOrderModalProps) => {
  const { userUid } = useAuth();
  // const { data: user } = useProfile<EmployeeEntity>(userUid);
  // const condoId = user?.condominiumCode;
  const condoId = storageGet("condoId") as string;
  const { data: condo } = useCondo(condoId);
  const { data: residents } = useResidentsByCondoId(condoId);
  const [loading, setLoading] = useState(false);
  const formationOptions =
    condo?.formationNames.map((item) => ({
      label: item,
      value: item.toLocaleLowerCase()
    })) ?? [];

  const orderTypeOptions = [
    { label: OrderType.MAIL, value: OrderType.MAIL.toLocaleLowerCase() },
    { label: OrderType.PACKAGE, value: OrderType.PACKAGE.toLocaleLowerCase() },
    {
      label: OrderType.LARGE_PACKAGE,
      value: OrderType.LARGE_PACKAGE.toLocaleLowerCase()
    },
    {
      label: OrderType.DELIVERY,
      value: OrderType.DELIVERY.toLocaleLowerCase()
    },
    {
      label: OrderType.FRAGILE_ITEM,
      value: OrderType.FRAGILE_ITEM.toLocaleLowerCase()
    },
    { label: OrderType.OTHER, value: OrderType.OTHER.toLocaleLowerCase() }
  ];

  const {
    handleSubmit,
    register,
    control,
    watch,
    formState: { errors },
    reset
  } = useForm<AddOrderForm>({
    mode: "all",
    criteriaMode: "all",
    resolver: zodResolver(AddOrderSchema),
    defaultValues: {
      date: orderData?.date ? timestampToDate(orderData.date) : new Date(),
      apartment: orderData?.apartment ?? "",
      formation:
        formationOptions.find((i) => i.label === orderData?.formation)?.value ??
        "",
      deliverTo:
        residents
          ?.find((item) => item.id === orderData?.deliverTo)
          ?.name?.toLowerCase() ?? orderData?.deliverTo,
      orderType: orderData?.orderType ?? "",
      deliverBy: orderData?.deliverBy ?? ""
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

  const handleForm = async (data: AddOrderForm) => {
    if (!condoId) return;

    setLoading(true);

    const resident = residents?.find(
      (item) =>
        item.name.toLocaleLowerCase() === data.deliverTo.toLocaleLowerCase()
    );

    if (!resident) {
      return;
    }

    const finalData: Omit<OrderEntity, "id"> = {
      condominiumId: condoId,
      employeeId: userUid,
      deliverTo: resident.id,
      date: Timestamp.fromDate(data.date),
      apartment: data.apartment,
      formation: formationOptions.find((v) => v.value === data.formation)
        ?.label as string,
      wasDelivered: orderData?.wasDelivered ?? false,
      orderType: data.orderType as OrderType,
      deliverBy: data.deliverBy
    };
    try {
      if (orderData) {
        await updateFirestoreDoc<Omit<OrderEntity, "id">>({
          documentPath: `/orders/${orderData.id}`,
          data: finalData
        });
        successToast("Encomenda editada com sucesso.");
      } else {
        await createFirestoreDoc<Omit<OrderEntity, "id">>({
          collectionPath: `orders`,
          data: finalData
        });
        successToast("Nova encomenda adicionada.");
        await sendNotification({
          content: "Entrega na portaria",
          title: "Entrega!",
          date: null,
          type: "delivery",
          users: [
            {
              tokens: resident?.tokens ?? [],
              userId: resident?.id ?? ""
            }
          ]
        });
      }
    } catch (error) {
      errorToast("Erro ao salvar a encomenda.");
    } finally {
      setLoading(false);
      queryClient.invalidateQueries(["orders", condoId]);
      reset();
      onOpenChange(false);
    }
  };

  const handleDelete = async () => {
    if (!orderData) return;
    setLoading(true);
    await deleteFirestoreDoc({
      documentPath: `/orders/${orderData.id}`
    });
    setLoading(false);
    successToast("Encomenda editada com sucesso.");
    queryClient.invalidateQueries(["orders", condoId]);
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
      title="Registrar encomenda"
      description="Insira as informações necessárias para registrar a encomenda"
      confirmBtn={
        <Button
          variant="icon"
          size="lg"
          className=" w-[210px] bg-[#202425]"
          loading={loading}
          onClick={handleSubmit(handleForm)}
        >
          {!orderData ? "Confirmar" : "Editar"}
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
      <form
        onSubmit={handleSubmit(handleForm)}
        className={`flex flex-col gap-y-4`}
      >
        {orderData && (
          <button
            type="button"
            onClick={handleDelete}
            className="absolute right-5 top-5 transition-all hover:scale-110"
          >
            <Image
              src={"/icons/commonArea/trash.svg"}
              width={30}
              height={30}
              alt="Icon de remoção"
            />
          </button>
        )}

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
          name="deliverBy"
          className={inputClassName}
          label="Remetente"
          register={register}
          placeholder="Digite o remetente"
        />
        <SelectField
          options={orderTypeOptions}
          formErrors={errors}
          name="orderType"
          className={inputClassName}
          label="Tipo de Encomenda"
          control={control}
          placeholder="Digite o tipo"
        />
        <div className="grid grid-cols-2 gap-x-2">
          <SelectField
            options={formationOptions}
            formErrors={errors}
            name="formation"
            className={inputClassName}
            label="Formação"
            control={control}
            placeholder="Digite a formação"
          />
          <SelectField
            options={watch("formation") ? apartmentOptions : []}
            formErrors={errors}
            name="apartment"
            className={inputClassName}
            label="Apartamento"
            control={control}
            placeholder="Digite o apartamento"
          />
        </div>
        <SelectField
          formErrors={errors}
          options={watch("apartment") ? residentsOptions : []}
          name="deliverTo"
          className={inputClassName}
          label="Destinatário"
          control={control}
          placeholder="Digite o destinatário"
        />
      </form>
    </TransitionModal>
  );
};

export default CreateOrderModal;
