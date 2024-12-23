import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { inputClassName } from "@/app/contants";
import AuthEnterModal from "@/components/atoms/AuthEnterModal/AuthEnterModal";
import Button from "@/components/atoms/Button/button";
import TransitionModal from "@/components/atoms/TransitionModal/tempModal";
import SelectField from "@/components/molecules/SelectField/selectField";
import useCondo from "@/hooks/queries/condos/useCondo";
import useResidentsByCondoId from "@/hooks/queries/residents/useResidentsByCondoId";
import { successToast, errorToast } from "@/hooks/useAppToast";
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
  const { data: condo } = useCondo(lostFoundData?.condominiumId as string);
  const { data: residents } = useResidentsByCondoId(
    lostFoundData?.condominiumId as string
  );
  const [modalOpen, setModalOpen] = useState(false);

  const [inputValue, setInputValue] = useState("");

  const {
    handleSubmit,
    control,
    watch,
    formState: { errors },
    reset
  } = useForm<SelectResidentForm>({
    mode: "all",
    criteriaMode: "all",
    resolver: zodResolver(SelectResidentSchema)
  });

  const formationOptions =
    condo?.formationNames.map((item) => ({
      label: item,
      value: item?.toLocaleLowerCase()
    })) ?? [];

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
          : true && watch("apartment")
            ? item.housingName === watch("apartment")
            : true
      )
      ?.map((item) => ({
        label: item.name,
        value: item.name + "|" + item.id
      })) ?? [];

  const handleForm = () => {
    setModalOpen(true);
  };

  const onConfirm = async () => {
    const chosenResidentId = watch("resident").split("|")[1];
    const chosenResident = residents?.find(
      (resident) => resident.id === chosenResidentId
    );
    if (chosenResident?.deliveryCode === inputValue) {
      await updateFirestoreDoc({
        documentPath: `/lost-and-found/${lostFoundData.id}`,
        data: { deliveredTo: chosenResident.id }
      });
      queryClient.invalidateQueries(["lostFound", lostFoundData.condominiumId]);
      successToast(`Achado entregue ao morador ${chosenResident.name}!`);
      onOpenChange(false);
      reset();
    } else {
      errorToast("Código não é válido.");
    }
  };

  return (
    <TransitionModal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
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
          onClick={() => {
            reset();
            onOpenChange(false);
          }}
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
            options={apartmentOptions}
            formErrors={errors}
            name="apartment"
            className={inputClassName}
            label="Apartamento"
            control={control}
            placeholder="Digite apartamento"
          />
        </div>
        <SelectField
          options={residentsOptions}
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
