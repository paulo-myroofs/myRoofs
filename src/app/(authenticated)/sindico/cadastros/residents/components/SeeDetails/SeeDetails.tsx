import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { inputClassName } from "@/app/contants";
import { DataPaginatedTable } from "@/components/atoms/DataTablePaginated/DataTablePaginated";
import TransitionModal from "@/components/atoms/TransitionModal/tempModal";
import InputField from "@/components/molecules/InputField/inputField";
import useAutosByResident from "@/hooks/queries/residents/automobiles/useAutosByResident";
import usePetsByResident from "@/hooks/queries/residents/pets/usePetsByResident";
import SeeResidentDetails from "@/validations/aptManager/SeeResidentDetails";

import { autoColumns } from "./components/autoColumns";
import { petColumns } from "./components/petColumns";
import { SeeDetailsProps } from "./types";

type SeeDetailsForm = z.infer<typeof SeeResidentDetails>;

const SeeDetails = ({
  isOpen,
  onOpenChange,
  residentData
}: SeeDetailsProps) => {
  const {
    register,
    formState: { errors }
  } = useForm<SeeDetailsForm>({
    mode: "all",
    criteriaMode: "all",
    resolver: zodResolver(SeeResidentDetails),
    values: {
      name: residentData?.name ?? "",
      email: residentData?.email ?? "",
      formation: residentData?.formationName ?? "",
      apartment: residentData?.housingName ?? ""
    }
  });

  const { data: pets } = usePetsByResident(residentData?.id as string);
  const { data: autos } = useAutosByResident(residentData?.id as string);

  return (
    <TransitionModal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title="Detalhes da reserva"
      description="Confira as informações necessárias para efetuar a solicitação"
      hasButtons={false}
      childrenClassName="space-y-4"
    >
      <form
        className={`w-full space-y-4 opacity-80`}
        onSubmit={(e) => e.preventDefault()}
      >
        <InputField
          className={inputClassName}
          label="Nome completo"
          name="name"
          disabled={true}
          register={register}
          formErrors={errors}
          placeholder="Digite aqui"
        />
        <InputField
          className={inputClassName}
          label="Email"
          name="email"
          disabled={true}
          register={register}
          formErrors={errors}
          placeholder="Digite aqui"
        />{" "}
        <div className="grid grid-cols-2 gap-x-2">
          <InputField
            formErrors={errors}
            register={register}
            name="formation"
            disabled={true}
            className={inputClassName}
            label="Formação"
            placeholder="Digite formação"
          />
          <InputField
            formErrors={errors}
            register={register}
            name="apartment"
            disabled={true}
            className={inputClassName}
            label="Apartamento"
            placeholder="Digite apartamento"
          />
        </div>
        <DataPaginatedTable data={pets ?? []} columns={petColumns} />
        <DataPaginatedTable
          data={autos?.concat(autos ?? []).concat(autos ?? []) ?? []}
          columns={autoColumns}
        />
      </form>
    </TransitionModal>
  );
};

export default SeeDetails;
