import React, { useEffect, useRef, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { formatToCPF } from "brazilian-values";
import { Timestamp } from "firebase/firestore";
import { Controller, useForm } from "react-hook-form";
import { twMerge } from "tailwind-merge";
import { z } from "zod";

import { inputClassName } from "@/app/contants";
import { TicketEntity } from "@/common/entities/common/condo/ticket";
import Button from "@/components/atoms/Button/button";
import { DatePicker } from "@/components/atoms/DatePicker/DatePicker";
import FormErrorLabel from "@/components/atoms/FormError/formError";
import Label from "@/components/atoms/Label/label";
import TransitionModal from "@/components/atoms/TransitionModal/tempModal";
import InputField from "@/components/molecules/InputField/inputField";
import SelectField from "@/components/molecules/SelectField/selectField";
import useCondo from "@/hooks/queries/condos/useCondo";
import useResidentsByCondoId from "@/hooks/queries/residents/useResidentsByCondoId";
import { errorToast, successToast } from "@/hooks/useAppToast";
import { queryClient } from "@/store/providers/queryClient";
import { createFirestoreDoc } from "@/store/services";
import { uploadFile } from "@/store/services/firebaseStorage";
import { timestampToDate } from "@/utils/timestampToDate";
import AddTicketSchema from "@/validations/aptManager/AddTicket";

import { CreateTicketModalProps } from "./types";

type AddTicketForm = z.infer<typeof AddTicketSchema>;

const CreateTicketModal = ({
  isOpen,
  onOpenChange,
  condoId,
  ticketData
}: CreateTicketModalProps) => {
  const { data: residents } = useResidentsByCondoId(condoId as string);
  const { data: condo } = useCondo(condoId as string);
  const inputUpload = useRef<HTMLInputElement | null>(null);
  const [ticketFile, setTicketFile] = useState<File | string | null>(null);
  const [loading, setLoading] = useState(false);
  const formationOptions =
    condo?.formationNames.map((item) => ({
      label: item,
      value: item.toLocaleLowerCase()
    })) ?? [];
  const nameOptions =
    residents?.map((item) => ({
      label: item.name,
      value: item.name.toLowerCase()
    })) ?? [];

  const {
    handleSubmit,
    register,
    control,
    watch,
    formState: { errors },
    reset
  } = useForm<AddTicketForm>({
    mode: "all",
    criteriaMode: "all",
    resolver: zodResolver(AddTicketSchema),
    defaultValues: {
      name: ticketData?.name ?? "",
      category: ticketData?.category ?? "",
      formation:
        formationOptions.find((i) => ticketData?.formationName === i.value)
          ?.label ?? "",
      apartment: ticketData?.apartment ?? "",
      date: ticketData?.date ? timestampToDate(ticketData?.date) : new Date()
    }
  });

  const chosenResident = residents?.find(
    (c) => c.name.toLowerCase() === watch("name")
  );

  const handleForm = async (data: AddTicketForm) => {
    if (!condo) return;
    if (!chosenResident) {
      return errorToast("Escolha o CPF.");
    }
    if (!ticketFile) {
      return errorToast("Adicione um documento.");
    }

    setLoading(true);

    let ticketFileUrl = "";
    const { fileUrl: ticketFileUploaded, error: errorUpload } =
      await uploadFile(ticketFile as File);

    if (errorUpload || !ticketFileUploaded) {
      setLoading(false);
      return errorToast(
        "Não foi possível fazer upload de boleto, entrar em contato."
      );
    }
    ticketFileUrl = ticketFileUploaded;

    const ticketData: Omit<TicketEntity, "id"> = {
      condominiumId: condoId,
      category: data.category,
      name: chosenResident.name,
      formationName: formationOptions.find((f) => f.value === data.formation)
        ?.label as string,
      apartment: data.apartment,
      date: Timestamp.fromDate(data.date),
      fileUrl: ticketFileUrl,
      residentId: chosenResident.id,
      status: data.status === "confirmado" ? "confirmed" : "pending"
    };

    await createFirestoreDoc<Omit<TicketEntity, "id">>({
      collectionPath: `tickets`,
      data: ticketData
    });

    successToast("Novo boleto adicionado.");
    setLoading(false);
    queryClient.invalidateQueries(["tickets", condoId]);
    reset();
    onOpenChange(false);
    setTicketFile(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setTicketFile(file);
    }
  };

  useEffect(() => {
    if (ticketData) {
      if (ticketData.fileUrl && !ticketFile) {
        setTicketFile(ticketData.fileUrl);
      }
    }
  }, [ticketData, ticketFile]);

  const statusOptions = ["Confirmado", "Pendente"].map((item) => ({
    label: item,
    value: item.toLocaleLowerCase()
  }));

  return (
    <TransitionModal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title="Registrar boleto"
      description="Insira as informações necessárias para registrar boleto"
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
      <form
        onSubmit={handleSubmit(handleForm)}
        className={`flex flex-col gap-y-4`}
      >
        <InputField
          formErrors={errors}
          name="category"
          className={inputClassName}
          label="Categoria"
          register={register}
          placeholder="Digite aqui"
        />

        <SelectField
          options={nameOptions}
          formErrors={errors}
          name="name"
          className={inputClassName}
          label="Nome do Morador"
          control={control}
          placeholder="Digite aqui"
        />
        <InputField
          mask={"999.999.999-99"}
          value={chosenResident?.cpf ? formatToCPF(chosenResident?.cpf) : ""}
          className={inputClassName}
          label="CPF"
          disabled={true}
          placeholder="Digite aqui"
        />
        <div className="grid grid-cols-2 gap-x-2">
          <SelectField
            options={formationOptions}
            formErrors={errors}
            name="formation"
            className={inputClassName}
            label="Formação"
            control={control}
            placeholder="Digite aqui"
          />
          <InputField
            formErrors={errors}
            name="apartment"
            className={inputClassName}
            label="Apartamento"
            register={register}
            placeholder="Digite aqui"
          />
        </div>
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

        <SelectField
          options={statusOptions}
          formErrors={errors}
          name="status"
          className={inputClassName}
          label="Status"
          control={control}
          placeholder="Digite aqui"
        />

        <div className="flex flex-col gap-1">
          <Label>Boleto </Label>
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
                {typeof ticketFile === "string" ? ticketFile : ticketFile.name}
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

export default CreateTicketModal;
