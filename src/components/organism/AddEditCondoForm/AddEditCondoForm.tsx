"use client";

import React, { useEffect, useRef, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { isCNPJ } from "brazilian-values";
import { Timestamp } from "firebase/firestore";
import { X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { twMerge } from "tailwind-merge";
import { z } from "zod";

import AddressInputs from "@/app/admin/nova-empresa/components/AddressInputs";
import { brazilStates } from "@/common/constants/brazilStates";
import { BrazilStatesOptionsType } from "@/common/entities/common/brazilStatesOptionsType";
import { CondoEntity } from "@/common/entities/common/condo/condo";
import { CondoCommonArea } from "@/common/entities/common/condo/condoCommonAreas";
import Button from "@/components/atoms/Button/button";
import Label from "@/components/atoms/Label/label";
import Select from "@/components/atoms/Select/select";
import TitleAtom from "@/components/atoms/TitleAtom/TitleAtom";
import CommonAreaInputs from "@/components/molecules/CommonAreaInputs/CommonAreaInputs";
import InputField from "@/components/molecules/InputField/inputField";
import useResidentsByCondoId from "@/hooks/queries/residents/useResidentsByCondoId";
import { errorToast, successToast } from "@/hooks/useAppToast";
import { queryClient } from "@/store/providers/queryClient";
import { createFirestoreDoc, updateFirestoreDoc } from "@/store/services";
import { deleteImage, uploadImage } from "@/store/services/firebaseStorage";
import formatToPhoneMask from "@/utils/formatToPhoneMask";
import unmask from "@/utils/unmask";
import AddCondoSchema from "@/validations/aptManager/AddCondo";

import { AddEditCondoFormProps } from "./types";

const inputClassName = "border-[#DEE2E6] bg-[#F8F9FA]";
type AddCondoForm = z.infer<typeof AddCondoSchema>;
interface InternalOrgInputsType {
  type: "Bloco" | "Torre" | "Unidade" | "Quadra" | "Lote" | "Outro";
  names: string[];
}

const defaultInternalOrgInput: InternalOrgInputsType = {
  type: "Bloco",
  names: [""]
};

interface InternalHabitationType {
  type:
    | "Apartamento"
    | "Bangalô"
    | "Casa"
    | "Cabana"
    | "Chalé"
    | "Kitnet"
    | "Studio"
    | "Outro";
  names: [""];
}

const defaultInternalHabitationIntput: InternalHabitationType = {
  type: "Apartamento",
  names: [""]
};

const AddEditCondoForm = ({
  companyId,
  aptManagersIds,
  condoData,
  setEditFalse,
  readOnly = false
}: AddEditCondoFormProps) => {
  const router = useRouter();
  const isEditing = !!condoData;
  const inputUpload = useRef<HTMLInputElement | null>(null);
  const [image, setImage] = useState<File | string | null>(null);
  const [commonAreas, setCommonAreas] = useState<
    CondoCommonArea[] | undefined
  >();
  const { data: residents } = useResidentsByCondoId(condoData?.id ?? "");
  const defaultValues = {
    name: condoData?.name ?? "",
    cnpj: condoData?.cnpj ?? "",
    addressData: {
      address: condoData?.addressData?.address ?? "",
      neighborhood: condoData?.addressData?.neighborhood ?? "",
      state:
        (brazilStates.find(
          (item) => item.label === condoData?.addressData?.state
        )?.value as string) || "",
      number: condoData?.addressData?.number ?? "",
      cep: condoData?.addressData?.cep ?? "",
      city: condoData?.addressData?.city ?? ""
    },
    phone: condoData?.phone ? formatToPhoneMask(condoData?.phone) : "",
    floorsQty: (condoData?.floorsQty ?? "0").toString(),
    aptQty: (condoData?.aptQty ?? "0").toString(),
    garageSpacesQty: (condoData?.garageQty ?? "0").toString()
  };

  const {
    handleSubmit,
    register,
    control,
    setValue,
    watch,
    formState: { errors },
    reset
  } = useForm<AddCondoForm>({
    mode: "all",
    criteriaMode: "all",
    resolver: zodResolver(AddCondoSchema),
    defaultValues
  });
  const [loading, setLoading] = useState(false);
  const [internalOrgInputs, setInternalOrgInputs] = useState<
    InternalOrgInputsType | undefined
  >();

  const [internalHabitationInputs, setInternalHabitationInputs] = useState<
    InternalHabitationType | undefined
  >();

  const [formationOther, setFormationOther] = useState<string>(
    condoData?.formationOther ?? ""
  );
  const [housingOther, setHousingOther] = useState<string>(
    condoData?.housingOther ?? ""
  );

  const handleForm = async (data: AddCondoForm) => {
    if (!aptManagersIds) return;
    if (!companyId) return;
    if (!isCNPJ(unmask(data.cnpj))) {
      return errorToast("CNPJ não é válido.");
    }
    if (!image) {
      return errorToast("Adicione uma imagem da empresa.");
    }

    if (!internalOrgInputs) {
      return;
    }
    if (!internalOrgInputs.type)
      return errorToast("Adicione um tipo de formação na Organização Interna.");
    if (internalOrgInputs.names.some((item) => !item))
      return errorToast(
        "Adicione um nome de formação válidos em Organização Interna."
      );

    if (!internalHabitationInputs) {
      return;
    }
    if (!internalHabitationInputs.type)
      return errorToast("Adicione um tipo de habitação.");

    setLoading(true);

    let imageUrl = condoData?.image ?? "";
    if (typeof image !== "string" && !!image) {
      const { image: imageUploaded, error: errorUpload } = await uploadImage(
        image as File
      );

      if (errorUpload || !imageUploaded) {
        setLoading(false);
        return errorToast(
          "Não foi possível fazer upload de imagem, entrar em contato."
        );
      }

      imageUrl = imageUploaded;
      if (condoData && condoData?.image) {
        await deleteImage(condoData.image);
      }
    }

    const finalData: Omit<CondoEntity, "id" | "createdAt"> = {
      commonAreas: commonAreas ?? null,
      companyId,
      aptManagersIds,
      name: data.name,
      image: imageUrl,
      cnpj: unmask(data.cnpj),
      addressData: {
        address: data.addressData.address || "",
        neighborhood: data.addressData.neighborhood || "",
        state: brazilStates.find(
          (item) => item.value === data.addressData.state
        )?.label as BrazilStatesOptionsType,
        city: data.addressData.city || "",
        number: data.addressData.number || "",
        cep: data.addressData.cep || ""
      },
      phone: unmask(data.phone),
      housingType: internalHabitationInputs.type,
      housingOther:
        internalHabitationInputs.type === "Outro" ? housingOther : null,
      floorsQty: parseInt(data.floorsQty),
      aptQty: parseInt(data.aptQty),
      garageQty: parseInt(data.garageSpacesQty),
      formationType: internalOrgInputs.type,
      formationNames: internalOrgInputs.names,
      formationOther:
        internalOrgInputs.type === "Outro" ? formationOther : null,
      activities: null,
      endedAt: null
    };

    if (isEditing) {
      await updateFirestoreDoc<Omit<CondoEntity, "id">>({
        documentPath: `condominium/${condoData.id}`,
        data: finalData
      });
      if (setEditFalse) {
        setEditFalse();
      }
      router.push("/sindico/condominio");
      successToast("Condomínio editado.");
    } else {
      await createFirestoreDoc<Omit<CondoEntity, "id">>({
        collectionPath: `condominium`,
        data: {
          ...finalData,
          createdAt: Timestamp.now()
        }
      });
      successToast("Novo condomínio adicionado.");
      setCommonAreas(undefined);
      setInternalOrgInputs(defaultInternalOrgInput);
      setImage(null);
      reset();
      router.push("/escolher-condominio");
    }

    queryClient.invalidateQueries(["condominium"]);
    setLoading(false);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
    }
  };

  useEffect(() => {
    if (condoData) {
      if (!commonAreas && condoData.commonAreas) {
        setCommonAreas(condoData.commonAreas);
      }
      if (!image && condoData.image) {
        setImage(condoData.image);
      }

      if (!internalHabitationInputs) {
        setInternalHabitationInputs({
          type: condoData.housingType,
          names: [""]
        });
      }

      if (!internalOrgInputs) {
        if (condoData.formationNames.length > 0) {
          setInternalOrgInputs({
            type: condoData.formationType,
            names: condoData.formationNames
          });
        }
      }
    }
  }, [
    condoData,
    internalOrgInputs,
    internalHabitationInputs,
    commonAreas,
    image
  ]);

  const handleCancel = () => {
    reset();
    if (condoData && internalOrgInputs) {
      if (condoData.commonAreas) {
        setCommonAreas(condoData.commonAreas);
      }
      if (condoData.formationNames.length > 0) {
        setInternalOrgInputs({
          type: condoData.formationType,
          names: condoData.formationNames
        });
      }
      if (condoData.housingType) {
        setInternalHabitationInputs({
          type: condoData.housingType,
          names: [""]
        });
      }
      setImage(null);
    } else {
      setCommonAreas(undefined);
      setInternalHabitationInputs(defaultInternalHabitationIntput);
      setInternalOrgInputs(defaultInternalOrgInput);
      setImage(null);
    }

    if (setEditFalse) {
      setEditFalse();
    }
  };

  return (
    <form
      onSubmit={handleSubmit(handleForm)}
      className={`space-y-10 ${readOnly && "pointer-events-none opacity-60"}`}
    >
      <div className="space-y-4">
        <div className="mt-4 grid gap-x-2 gap-y-4 sm:grid-cols-2">
          <div className="flex flex-col justify-between gap-y-4 sm:gap-y-0">
            <InputField
              formErrors={errors}
              name="name"
              className={inputClassName}
              label="Nome do condomínio"
              register={register}
              placeholder="Digite o nome"
            />
            <InputField
              formErrors={errors}
              name="cnpj"
              mask={"99.999.999/9999-99"}
              className={inputClassName}
              label="CNPJ"
              register={register}
              placeholder="Digite o nome"
            />
          </div>
          <div className="flex flex-col gap-1">
            <Label>Imagem do condomínio </Label>
            <input
              type="file"
              ref={inputUpload}
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />

            <button
              type="button"
              onClick={() => inputUpload?.current?.click()}
              className={twMerge(
                "relative flex h-[130px] w-full items-center justify-center gap-1 overflow-hidden rounded-sm border border-gray-300 px-3 text-sm text-black/50 outline-none transition-all hover:opacity-60",
                inputClassName
              )}
            >
              {image ? (
                <Image
                  src={
                    typeof image === "string"
                      ? image
                      : URL.createObjectURL(image)
                  }
                  fill
                  sizes="440px"
                  alt="Imagem da empresa"
                  className="object-cover"
                />
              ) : (
                "Faça upload de uma imagem"
              )}
            </button>
          </div>
        </div>
        <AddressInputs
          control={control}
          inputClassName={inputClassName}
          register={register}
          formErrors={errors}
          zodObj="addressData"
          setValue={setValue}
          watchCep={unmask(watch("addressData.cep") ?? "")}
        />
        <InputField
          name="phone"
          className={inputClassName}
          label="Telefone"
          mask={"(99) 99999-9999"}
          register={register}
          formErrors={errors}
          placeholder="Digite seu telefone"
        />
      </div>

      <div className="space-y-4">
        <TitleAtom className="text-center text-[18px] sm:text-[24px]">
          Organização Interna
        </TitleAtom>

        <div className="flex w-full flex-col gap-1">
          <Label>Tipo de formação</Label>
          <Select
            className={inputClassName}
            value={internalOrgInputs?.type ?? ""}
            onChange={(value) => {
              setInternalOrgInputs((prev) =>
                prev
                  ? {
                      ...prev,
                      type: value as InternalOrgInputsType["type"]
                    }
                  : {
                      type: value as InternalOrgInputsType["type"],
                      names: [""]
                    }
              );
              if (value === "Outro") {
                setFormationOther("");
              } else {
                setFormationOther("");
              }
            }}
            options={[
              { label: "Bloco", value: "Bloco" },
              { label: "Torre", value: "Torre" },
              { label: "Unidade", value: "Unidade" },
              { label: "Quadra", value: "Quadra" },
              { label: "Lote", value: "Lote" },
              { label: "Outro", value: "Outro" }
            ]}
            disabled={isEditing}
          />
        </div>

        {internalOrgInputs?.type === "Outro" && (
          <InputField
            name="formationOther"
            className={inputClassName}
            label="Nome da formação"
            value={formationOther}
            onChange={(e) => setFormationOther(e.target.value)}
            placeholder="Digite o nome da formação"
            disabled={isEditing}
          />
        )}

        {Array.from(
          { length: internalOrgInputs?.names.length ?? 1 },
          (_, index) => index
        ).map((index) => (
          <div className="relative" key={index as number}>
            <InputField
              className={inputClassName + " disabled:opacity-50"}
              label={"Nome da formação " + (index + 1)}
              value={internalOrgInputs?.names[index as number] ?? ""}
              onChange={(e) =>
                setInternalOrgInputs((prev) =>
                  prev
                    ? {
                        ...prev,
                        names: prev.names.map((item, ind) =>
                          index === ind ? e.target.value : item
                        )
                      }
                    : undefined
                )
              }
              placeholder="Digite o nome da formação"
              disabled={
                isEditing &&
                condoData?.formationNames?.includes(
                  internalOrgInputs?.names[index as number] ?? ""
                )
              }
            />
            {!readOnly &&
              index !== 0 &&
              !residents?.find(
                (r) =>
                  r.formationName === internalOrgInputs?.names[index as number]
              ) && (
                <X
                  size={18}
                  className="absolute right-0 top-0 opacity-70 hover:opacity-100"
                  onClick={() =>
                    setInternalOrgInputs((prev) =>
                      prev
                        ? {
                            ...prev,
                            names: prev?.names.filter((_, ind) => ind !== index)
                          }
                        : undefined
                    )
                  }
                />
              )}
          </div>
        ))}

        {!readOnly && (
          <div className="flex w-full items-center justify-between">
            <p className="text-black/60">
              {" "}
              *Não se pode editar nome nem excluir uma formação que já tem
              moradores associados
            </p>
            <Button
              variant="basicBlack"
              size="md"
              type="button"
              onClick={() => {
                if (internalOrgInputs?.names.some((i) => !i))
                  return errorToast(
                    "Termine de adicionar as formações existentes"
                  );
                setInternalOrgInputs((prev) =>
                  prev
                    ? {
                        ...prev,
                        names: [...prev.names, ""]
                      }
                    : undefined
                );
              }}
            >
              Adicionar
            </Button>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <TitleAtom className="text-center text-[18px] sm:text-[24px]">
          Unidade habitacionais
        </TitleAtom>

        <div className="flex w-full flex-col gap-1">
          <Label>Tipo de habitação</Label>
          <Select
            className={inputClassName}
            value={internalHabitationInputs?.type ?? ""}
            onChange={(value) => {
              setInternalHabitationInputs((prev) =>
                prev
                  ? {
                      ...prev,
                      type: value as InternalHabitationType["type"]
                    }
                  : {
                      type: value as InternalHabitationType["type"],
                      names: [""]
                    }
              );
              if (value === "Outro") {
                setHousingOther("");
              } else {
                setHousingOther("");
              }
            }}
            options={[
              { label: "Apartamento", value: "Apartamento" },
              { label: "Bangalô", value: "Bangalô" },
              { label: "Casa", value: "Casa" },
              { label: "Cabana", value: "Cabana" },
              { label: "Chalé", value: "Chalé" },
              { label: "Kitnet", value: "Kitnet" },
              { label: "Studio", value: "Studio" },
              { label: "Outro", value: "Outro" }
            ]}
            disabled={isEditing}
          />
        </div>

        {internalHabitationInputs?.type === "Outro" && (
          <InputField
            name="housingOther"
            className={inputClassName}
            label="Nome da habitação"
            value={housingOther}
            onChange={(e) => setHousingOther(e.target.value)}
            placeholder="Digite o nome da habitação"
            disabled={isEditing}
          />
        )}

        <InputField
          name="floorsQty"
          className={`${inputClassName} disabled:opacity-50`}
          label="Número de andares/Quantidade de Formação"
          register={register}
          formErrors={errors}
          placeholder="Digite aqui a quantidade de andares"
          disabled={isEditing}
        />
        <InputField
          name="aptQty"
          className={`${inputClassName} disabled:opacity-50`}
          label="Apartamentos por andar/Quantidade de tipo de habitação"
          register={register}
          formErrors={errors}
          placeholder="Digite aqui a quantidade de apartamentos"
          disabled={isEditing}
        />
        <InputField
          name="garageSpacesQty"
          className={inputClassName}
          label="Vagas da garagem"
          register={register}
          formErrors={errors}
          placeholder="Digite aqui a quanitdade de vagas da garagem"
        />
      </div>

      <div className="space-y-4">
        <TitleAtom className="text-center text-[18px] sm:text-[24px]">
          Áreas comuns
        </TitleAtom>

        <CommonAreaInputs
          commonAreas={commonAreas}
          setCommonAreas={setCommonAreas}
          readOnly={readOnly}
        />
      </div>

      {!readOnly && (
        <div className="mt-8 flex items-center justify-center gap-8">
          <Button
            variant="outline-black"
            size="md"
            type="button"
            disabled={loading}
            onClick={handleCancel}
          >
            Cancelar
          </Button>
          <Button
            variant="icon"
            size="md"
            className=" w-[180px] bg-[#202425]"
            type="submit"
            loading={loading}
          >
            {isEditing ? "Salvar" : "Registrar"}
          </Button>
        </div>
      )}
    </form>
  );
};

export default AddEditCondoForm;
