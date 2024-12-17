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

const defaultInternalOrgInput = {
  type: "Bloco" as "Bloco" | "Torre" | "Unidade" | "Quadra" | "Lote" | "Outro",
  names: [""]
};

interface HousingInputs {
  type:
    | "Apartamento"
    | "Bangalô"
    | "Casa"
    | "Cabana"
    | "Chalé"
    | "Kitnet"
    | "Studio"
    | "Outro"; // Usando o tipo que você acabou de definir
  names: string[];
}

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

  const {
    handleSubmit,
    register,
    formState: { errors },
    reset
  } = useForm<AddCondoForm>({
    mode: "all",
    criteriaMode: "all",
    resolver: zodResolver(AddCondoSchema),
    values: {
      name: condoData?.name ?? "",
      cnpj: condoData?.cnpj ?? "",
      address: condoData?.address ?? "",
      phone: condoData?.phone ? formatToPhoneMask(condoData?.phone) : "",
      floorsQty: (condoData?.floorsQty ?? "0").toString(),
      garageSpacesQty: (condoData?.garageQty ?? "0").toString()
    }
  });
  const [loading, setLoading] = useState(false);
  const [internalOrgInputs, setInternalOrgInputs] = useState<
    InternalOrgInputsType | undefined
  >();
  const [otherFormationName, setOtherFormationName] = useState("");

  const [housingInputs, setHousingInputs] = useState<
    HousingInputs | undefined
  >();

  const housingNameValue = housingInputs?.names?.[0] ?? "";

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
    if (internalOrgInputs?.type === "Outro") {
      internalOrgInputs.names = [otherFormationName];
    }

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
      address: data.address,
      phone: unmask(data.phone),
      housingName: housingNameValue,
      floorsQty: parseInt(data.floorsQty),
      garageQty: parseInt(data.garageSpacesQty),
      formationType: internalOrgInputs.type,
      formationNames: internalOrgInputs.names,
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
    }

    setLoading(false);
    queryClient.invalidateQueries(["condominium"]);
    reset();
    router.push("/escolher-condominio");
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

      if (!internalOrgInputs) {
        if (condoData.formationNames.length > 0) {
          setInternalOrgInputs({
            type: condoData.formationType,
            names: condoData.formationNames
          });
        }
      }
    }
  }, [condoData, internalOrgInputs, commonAreas, image]);

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
      setImage(null);
    } else {
      setCommonAreas(undefined);
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
        <InputField
          name="address"
          className={inputClassName}
          label="Endereço"
          register={register}
          formErrors={errors}
          placeholder="Digite seu endereço"
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
                      type: value as
                        | "Bloco"
                        | "Torre"
                        | "Unidade"
                        | "Quadra"
                        | "Lote"
                        | "Outro",
                      names: value === "Outro" ? prev.names : [""]
                    }
                  : {
                      type: value as
                        | "Bloco"
                        | "Torre"
                        | "Unidade"
                        | "Quadra"
                        | "Lote"
                        | "Outro",
                      names: value === "Outro" ? [""] : [""]
                    }
              );

              if (value !== "Outro") {
                setOtherFormationName("");
              }
            }}
            options={[
              { label: "Torre", value: "Torre" },
              { label: "Bloco", value: "Bloco" },
              { label: "Unidade", value: "Unidade" },
              { label: "Quadra", value: "Quadra" },
              { label: "Lote", value: "Lote" },
              { label: "Outro", value: "Outro" }
            ]}
          />
        </div>

        {internalOrgInputs?.type === "Outro" && (
          <div className="relative">
            <InputField
              className={inputClassName}
              label="Especificar Outro"
              value={otherFormationName}
              onChange={(e) => setOtherFormationName(e.target.value)}
              placeholder="Digite a formação"
            />
          </div>
        )}

        {Array.from(
          { length: internalOrgInputs?.names.length ?? 1 },
          (_, index) => index
        ).map((index) => (
          <div className="relative" key={index as number}>
            <InputField
              // disabled={
              //   !!residents?.find(
              //     (r) =>
              //       r.formationName ===
              //       internalOrgInputs?.names[index as number]
              //   )
              // }
              className={inputClassName + " disabled:opacity-50"}
              label={"Nome da formação " + (index + 1)}
              value={internalOrgInputs?.names[index as number]}
              onChange={(e) =>
                setInternalOrgInputs((prev) => {
                  if (!prev) return;
                  return {
                    ...prev,
                    names: prev.names.map((item, ind) =>
                      index === ind ? e.target.value : item
                    )
                  };
                })
              }
              placeholder="Digite o nome da formação"
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
                    setInternalOrgInputs((prev) => {
                      if (!prev) return;
                      return {
                        ...prev,
                        names: prev?.names.filter((_, ind) => ind !== index)
                      };
                    })
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
          <Label>Unidades Habitacionais</Label>
          <Select
            className={inputClassName}
            value={housingInputs?.type ?? ""}
            onChange={(value) =>
              setHousingInputs((prev) =>
                prev
                  ? {
                      ...prev,
                      type: value as
                        | "Apartamento"
                        | "Bangalô"
                        | "Casa"
                        | "Cabana"
                        | "Chalé"
                        | "Kitnet"
                        | "Studio"
                        | "Outro"
                    }
                  : {
                      type: value as
                        | "Apartamento"
                        | "Bangalô"
                        | "Casa"
                        | "Cabana"
                        | "Chalé"
                        | "Kitnet"
                        | "Studio"
                        | "Outro",
                      names: [""]
                    }
              )
            }
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
          />
        </div>
        {housingInputs?.type === "Outro" && (
          <div className="relative">
            <InputField
              className={inputClassName}
              label="Especificar Outro"
              value={housingInputs?.names[0] || ""}
              onChange={(e) =>
                setHousingInputs((prev) => {
                  if (!prev) return;
                  return {
                    ...prev,
                    names: [e.target.value]
                  };
                })
              }
              placeholder="Digite a unidade habitacional"
            />
          </div>
        )}
        <InputField
          name="floorsQty"
          className={inputClassName}
          label="Número de andares"
          register={register}
          formErrors={errors}
          placeholder="Digite aqui a quantidade de andares"
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
            className="w-[180px]"
            type="button"
            disabled={loading}
            onClick={handleCancel}
          >
            Cancelar
          </Button>
          <Button
            variant="icon"
            size="md"
            className="w-[180px] bg-[#202425]"
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
