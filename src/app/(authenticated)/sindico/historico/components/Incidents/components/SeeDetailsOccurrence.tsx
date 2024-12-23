import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useForm } from "react-hook-form";
import z from "zod";

import { inputClassName } from "@/app/contants";
import TransitionModal from "@/components/atoms/TransitionModal/tempModal";
import InputField from "@/components/molecules/InputField/inputField";
import TextareaField from "@/components/molecules/TextareaField/TextareaField";
import AddWarning from "@/validations/aptManager/AddWarning";

import { SeeDetailsOccurrenceProps } from "./types";

type SeeDetailsForm = z.infer<typeof AddWarning>;

const SeeDetailsOccurrence: React.FC<SeeDetailsOccurrenceProps> = ({
  isOpen,
  onOpenChange,
  occurenceData: data
}) => {
  const {
    register,
    formState: { errors }
  } = useForm<SeeDetailsForm>({
    mode: "all",
    criteriaMode: "all",
    resolver: zodResolver(AddWarning),
    values: {
      title: data?.title ?? "",
      description: data?.details ?? ""
    }
  });
  return (
    <TransitionModal
      hasButtons={false}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title="Detalhes da ocorrência"
      childrenClassName="space-y-4"
    >
      <form
        className={` w-full space-y-4 opacity-80`}
        onSubmit={(e) => e.preventDefault()}
      >
        <InputField
          className={inputClassName}
          label="Título da Ocorrência"
          name="title"
          disabled={true}
          register={register}
          formErrors={errors}
        />
        <Image
          src={data.upload ?? ""}
          alt="Occurrence Image"
          height={500}
          width={500}
          className="h-auto w-full"
        />
        <TextareaField
          className={inputClassName}
          label="Descrição da Ocorrência"
          name="description"
          disabled={true}
          formRegister={register}
          formErrors={errors}
          placeholder="Descreva a ocorrência"
        />
      </form>
    </TransitionModal>
  );
};

export default SeeDetailsOccurrence;
