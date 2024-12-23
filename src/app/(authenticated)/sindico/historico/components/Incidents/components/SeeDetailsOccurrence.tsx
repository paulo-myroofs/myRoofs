import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useForm } from "react-hook-form";
import z from "zod";

import { inputClassName } from "@/app/contants";
import Button from "@/components/atoms/Button/button";
import TransitionModal from "@/components/atoms/TransitionModal/tempModal";
import InputField from "@/components/molecules/InputField/inputField";
import TextareaField from "@/components/molecules/TextareaField/TextareaField";
import { successToast } from "@/hooks/useAppToast";
import { queryClient } from "@/store/providers/queryClient";
import { updateFirestoreDoc } from "@/store/services";
import SeeOccurrenceDetails from "@/validations/aptManager/SeeOccurrenceDetails";

import { SeeDetailsOccurrenceProps } from "./types";

type SeeDetailsForm = z.infer<typeof SeeOccurrenceDetails>;

const SeeDetailsOccurrence: React.FC<SeeDetailsOccurrenceProps> = ({
  isOpen,
  onOpenChange,
  occurenceData
}) => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset
  } = useForm<SeeDetailsForm>({
    mode: "all",
    criteriaMode: "all",
    resolver: zodResolver(SeeOccurrenceDetails),
    values: {
      title: occurenceData?.title ?? "",
      description: occurenceData?.details ?? "",
      response: occurenceData?.response ?? ""
    }
  });

  const [loading, setLoading] = useState(false);

  const handleForm = async (data: SeeDetailsForm) => {
    if (!occurenceData) return;

    setLoading(true);

    await updateFirestoreDoc({
      documentPath: `/occurrences/${occurenceData.id}`,
      data: {
        response: data.response
      }
    });

    successToast("Resposta da ocorrência atualizada com sucesso");
    setLoading(false);
    queryClient.invalidateQueries(["occurrences", occurenceData.condoId]);
    onOpenChange(false);
  };

  return (
    <TransitionModal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title="Detalhes da ocorrência"
      childrenClassName="space-y-4"
      confirmBtn={
        <Button
          variant="icon"
          size="lg"
          className=" w-[210px] bg-[#202425]"
          onClick={handleSubmit(handleForm)}
          loading={loading}
        >
          Registrar
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
        className={` w-full space-y-4 opacity-80`}
        onSubmit={handleSubmit(handleForm)}
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
          src={occurenceData.upload ?? ""}
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
        <TextareaField
          className={inputClassName}
          label="Resposta do Síndico"
          name="response"
          formRegister={register}
          formErrors={errors}
          placeholder="Descreva a resposta do síndico"
        />
      </form>
    </TransitionModal>
  );
};

export default SeeDetailsOccurrence;
