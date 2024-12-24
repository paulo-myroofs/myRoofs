import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { inputClassName } from "@/app/contants";
import { EmployeeEntity } from "@/common/entities/employee";
import AuthEnterModal from "@/components/atoms/AuthEnterModal/AuthEnterModal";
import Button from "@/components/atoms/Button/button";
import TransitionModal from "@/components/atoms/TransitionModal/tempModal";
import SelectField from "@/components/molecules/SelectField/selectField";
import useCondo from "@/hooks/queries/condos/useCondo";
import useResidentsByUserData from "@/hooks/queries/residents/useResidentByUserData";
import useResidentsByCondoId from "@/hooks/queries/residents/useResidentsByCondoId";
import useProfile from "@/hooks/queries/useProfile";
import { successToast, errorToast } from "@/hooks/useAppToast";
import useAuth from "@/hooks/useAuth";
import { queryClient } from "@/store/providers/queryClient";
import { updateFirestoreDoc } from "@/store/services";
import removeDuplicates from "@/utils/removeDuplicates";
import SelectResidentSchema from "@/validations/employee/SelectResident";

import { ValidateDeliverLostFoundProps } from "./types";
type SelectResidentForm = z.infer<typeof SelectResidentSchema>;

const ValidateDeliverLostFound = ({
  isOpen,
  onOpenChange,
  lostFoundData
}: ValidateDeliverLostFoundProps) => {
  const { userUid } = useAuth();
  const { data: user } = useProfile<EmployeeEntity>(userUid);
  const condoId = user?.condominiumCode;
  const { data: condo } = useCondo(condoId as string);
  const { data: residents } = useResidentsByCondoId(condoId as string);
  const [modalOpen, setModalOpen] = useState(false);

  const [inputValue, setInputValue] = useState("");
  const [deliveryCode, setDeliveryCode] = useState("");
  const [deliveredUserId, setDeliveredUserId] = useState("");
  const [deliveredUserName, setDeliveredUserName] = useState("");

  const formationOptions =
    condo?.formationNames.map((item) => ({
      label: item,
      value: item?.toLocaleLowerCase()
    })) ?? [];

  const {
    handleSubmit,
    control,
    watch,
    formState: { errors },
    reset
  } = useForm<SelectResidentForm>({
    mode: "all",
    criteriaMode: "all",
    resolver: zodResolver(SelectResidentSchema),
    defaultValues: {
      formation: "",
      apartment: "",
      resident: ""
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
        value: item.name
      })) ?? [];

  const { data: chosenResidentData } = useResidentsByUserData(
    watch("formation"),
    watch("apartment"),
    watch("resident")
  );

  const handleForm = async () => {
    if (chosenResidentData && chosenResidentData.length > 0) {
      if (chosenResidentData[0].deliveryCode) {
        setDeliveryCode(chosenResidentData[0].deliveryCode);
      }
      setDeliveredUserId(chosenResidentData[0].id);
      setDeliveredUserName(chosenResidentData[0].name);
    }
    setModalOpen(true);
  };

  const onConfirm = async () => {
    if (deliveryCode === inputValue) {
      await updateFirestoreDoc({
        documentPath: `/lost-and-found/${lostFoundData.id}`,
        data: {
          deliveredTo: deliveredUserId,
          deliveredBy: userUid
        }
      });
      queryClient.invalidateQueries(["lostFound", lostFoundData.condominiumId]);
      successToast(`Achado entregue ao morador ${deliveredUserName}!`);
      onOpenChange(false);
      reset();
    } else {
      errorToast("Código não é válido.");
    }
  };

  const handleClose = () => {
    reset();
    onOpenChange(false);
  };

  return (
    <TransitionModal
      isOpen={isOpen}
      onOpenChange={handleClose}
      title="Escolha morador pra entregar encomenda"
      description="Preecha as informações do morador"
      confirmBtn={
        <Button
          variant="icon"
          size="lg"
          className=" w-[210px] bg-[#202425]"
          form="select-form"
        >
          Validar
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
        id="select-form"
        onSubmit={handleSubmit(handleForm)}
        className="space-y-4"
      >
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

      <AuthEnterModal
        isOpen={modalOpen}
        onOpenChange={setModalOpen}
        inputValue={inputValue}
        setInputValue={setInputValue}
        onConfirm={onConfirm}
        onCancel={() => setInputValue("")}
      />
    </TransitionModal>
  );
};

export default ValidateDeliverLostFound;
