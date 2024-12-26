import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { twMerge } from "tailwind-merge";
import z from "zod";

import { inputClassName } from "@/app/contants";
import Button from "@/components/atoms/Button/button";
import Label from "@/components/atoms/Label/label";
import TransitionModal from "@/components/atoms/TransitionModal/tempModal";
import InputField from "@/components/molecules/InputField/inputField";
import TextareaField from "@/components/molecules/TextareaField/TextareaField";
import { successToast } from "@/hooks/useAppToast";
import { queryClient } from "@/store/providers/queryClient";
import { updateFirestoreDoc } from "@/store/services";
import SeeOccurrenceDetails from "@/validations/aptManager/SeeOccurrenceDetails";

import { SeeDetailsOccurrenceProps } from "./types";

import { Reaction } from "../types";

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
        response: data.response,
        reaction: Reaction.NONE
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
        <div className="gap flex flex-col gap-1">
          <Label>Descrição da ocorrência</Label>
          <div
            className={twMerge(
              `w-full items-center gap-1 rounded-sm border border-gray-300 px-2 py-2 text-sm outline-none focus:border-black sm:px-4 sm:text-base`,
              inputClassName
            )}
            id="description"
            style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}
          >
            {occurenceData?.details ?? ""}
          </div>
        </div>
        <TextareaField
          className={inputClassName}
          label="Resposta do Síndico"
          name="response"
          formRegister={register}
          formErrors={errors}
          placeholder="Descreva a resposta do síndico"
        />
      </form>
      <div className="flex w-full justify-center gap-4">
        {occurenceData.reaction === Reaction.LIKE ? (
          <Image
            src="/icons/historic/like_green.svg"
            alt="Like Icon"
            width={32}
            height={32}
          />
        ) : (
          <Image
            src="/icons/historic/like.svg"
            alt="Like Icon"
            width={32}
            height={32}
          />
        )}
        {occurenceData.reaction === Reaction.DISLIKE ? (
          <Image
            src="/icons/historic/dislike_red.svg"
            alt="Dislike Icon"
            width={32}
            height={32}
          />
        ) : (
          <Image
            src="/icons/historic/dislike.svg"
            alt="Dislike Icon"
            width={32}
            height={32}
          />
        )}
      </div>
    </TransitionModal>
  );
};

export default SeeDetailsOccurrence;
