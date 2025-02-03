import React, { useEffect, useMemo, useRef, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Timestamp } from "firebase/firestore";
import Image from "next/image";
import { Controller, useForm } from "react-hook-form";
import { twMerge } from "tailwind-merge";
import { z } from "zod";

import { inputClassName } from "@/app/contants";
import { InstallmentEntity } from "@/common/entities/common/condo/installment";
import Button from "@/components/atoms/Button/button";
import { DatePicker } from "@/components/atoms/DatePicker/DatePicker";
import FormErrorLabel from "@/components/atoms/FormError/formError";
import Label from "@/components/atoms/Label/label";
import TransitionModal from "@/components/atoms/TransitionModal/tempModal";
import SelectField from "@/components/molecules/SelectField/selectField";
import useCondoInstallments, {
  getCondoInstallmentsQueryKey
} from "@/hooks/queries/condos/installments/useCondoInstallments";
import useCondo from "@/hooks/queries/condos/useCondo";
import { errorToast, successToast } from "@/hooks/useAppToast";
import { queryClient } from "@/store/providers/queryClient";
import {
  createFirestoreDoc,
  deleteFirestoreDoc,
  updateFirestoreDoc
} from "@/store/services";
import { uploadFile } from "@/store/services/firebaseStorage";
import { extractFilename } from "@/utils/extractFilename";
import { timestampToDate } from "@/utils/timestampToDate";
import AddInstallmentSchema from "@/validations/aptManager/AddInstallment";

import { CreateAccountabilityModalProps } from "./types";

type AddInstallmentForm = z.infer<typeof AddInstallmentSchema>;

const CreateAccountabilityModal = ({
  isOpen,
  onOpenChange,
  condoId,
  installmentData
}: CreateAccountabilityModalProps) => {
  const { data: condo } = useCondo(condoId as string);
  const { data: installments } = useCondoInstallments(condoId as string);
  const inputUpload = useRef<HTMLInputElement | null>(null);
  const [ticketFile, setTicketFile] = useState<File | string | null>(null);
  const [loading, setLoading] = useState(false);
  const formationOptions = useMemo(
    () =>
      condo?.formationNames.map((item) => ({
        label: item,
        value: item.toLocaleLowerCase()
      })) ?? [],
    [condo]
  );

  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
    reset
  } = useForm<AddInstallmentForm>({
    mode: "all",
    criteriaMode: "all",
    resolver: zodResolver(AddInstallmentSchema),
    defaultValues: {
      formation:
        formationOptions.find((i) => installmentData?.formation === i.label)
          ?.value ?? "",
      date: installmentData?.date
        ? timestampToDate(installmentData?.date)
        : new Date()
    }
  });

  const handleForm = async (data: AddInstallmentForm) => {
    if (!installments) return;

    const repeated = installments?.find((item) => {
      const date = new Date(item.date.seconds * 1000);
      const curDate = data.date;
      const curFormation = formationOptions.find(
        (v) => v.value === data.formation
      )?.label;
      return (
        date.getMonth() === curDate.getMonth() &&
        curDate.getFullYear() === date.getFullYear() &&
        curFormation === item.formation
      );
    });

    if (repeated) {
      if (installmentData) {
        if (repeated.id !== installmentData.id) {
          return errorToast(
            "Já existe outra prestação de conta adicionada pra o mês especificado no formulário."
          );
        }
      } else {
        return errorToast(
          "Prestação de conta já foi adicionada pra esse mês pra essa formação."
        );
      }
    }
    if (!installmentData && !ticketFile) {
      return errorToast("Adicione um documento.");
    }

    let ticketFileUrl = installmentData?.fileUrl;

    if (typeof ticketFile !== "string" && !!ticketFile) {
      setLoading(true);

      const { fileUrl: fileUploaded, error: errorUpload } = await uploadFile(
        ticketFile as File
      );

      if (errorUpload || !fileUploaded) {
        setLoading(false);
        return errorToast(
          "Não foi possível fazer upload de boleto, entrar em contato."
        );
      }
      ticketFileUrl = fileUploaded;
    }

    const finalData: Omit<InstallmentEntity, "id"> = {
      condominiumId: condoId,
      formation: formationOptions.find((v) => v.value === data.formation)
        ?.label as string,
      date: Timestamp.fromDate(data.date),
      fileUrl: ticketFileUrl as string
    };

    if (installmentData) {
      await updateFirestoreDoc<Omit<InstallmentEntity, "id">>({
        documentPath: `installments/${installmentData.id}`,
        data: finalData
      });
      successToast("Prestação alterada com sucesso.");
    } else {
      await createFirestoreDoc<Omit<InstallmentEntity, "id">>({
        collectionPath: `installments`,
        data: finalData
      });
      successToast("Nova prestação adicionada.");
    }

    setLoading(false);
    queryClient.invalidateQueries(["installments", condoId]);
    reset();
    onOpenChange(false);
    setTicketFile(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const currentFile = e.target.files?.[0];
    if (currentFile) {
      setTicketFile(currentFile);
    }
  };

  const handleDelete = async () => {
    if (!installmentData) return;
    setLoading(true);
    await deleteFirestoreDoc({
      documentPath: `/installments/${installmentData.id}`
    });
    setLoading(false);
    successToast("Prestação de conta removida com sucesso.");
    queryClient.invalidateQueries(getCondoInstallmentsQueryKey(condoId));
    onOpenChange(false);
  };

  useEffect(() => {
    if (installmentData) {
      if (installmentData.fileUrl && !ticketFile) {
        setTicketFile(installmentData.fileUrl);
      }

      if (installmentData.formation && formationOptions) {
        setValue(
          "formation",
          formationOptions.find((i) => installmentData?.formation === i.label)
            ?.value as string
        );
      }
    }
  }, [installmentData, ticketFile, formationOptions, setValue]);

  return (
    <TransitionModal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title="Registrar prestação de contas"
      description="Insira as informações necessárias para registrar prestação"
      confirmBtn={
        <Button
          variant="icon"
          size="lg"
          className="w-[210px] bg-[#202425]"
          loading={loading}
          onClick={handleSubmit(handleForm)}
        >
          Confirmar
        </Button>
      }
      cancelBtn={
        <Button
          onClick={() => {
            reset();
            setTicketFile(null);
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
      {installmentData && (
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
        <SelectField
          options={formationOptions}
          formErrors={errors}
          name="formation"
          className={inputClassName}
          label="Formação"
          control={control}
          placeholder="Digite aqui"
        />
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

        <div className="flex flex-col gap-1">
          <Label>Arquivo </Label>
          <input
            type="file"
            ref={inputUpload}
            accept=".pdf, .doc, .docx, .xls, .xlsx, .ppt, .pptx, .txt, .csv, .rtf, .odt"
            className="hidden"
            onChange={handleFileChange}
          />

          <button
            type="button"
            onClick={() => inputUpload?.current?.click()}
            className={twMerge(
              "relative flex h-[130px] w-full items-center justify-center gap-1 overflow-hidden rounded-sm border border-gray-300 px-3 text-sm text-black/50 transition-all outline-none hover:opacity-60",
              inputClassName
            )}
          >
            {ticketFile ? (
              <p className="text-black">
                {typeof ticketFile === "string"
                  ? extractFilename(ticketFile)
                  : ticketFile.name}
              </p>
            ) : (
              <strong>Clique para fazer upload</strong>
            )}
          </button>
        </div>
      </form>
    </TransitionModal>
  );
};

export default CreateAccountabilityModal;
