import { useEffect, useRef, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Timestamp } from "firebase/firestore";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { twMerge } from "tailwind-merge";
import { z } from "zod";

import { inputClassName } from "@/app/contants";
import { CondoAssembly } from "@/common/entities/notices/condoAssemblies";
import Button from "@/components/atoms/Button/button";
import Label from "@/components/atoms/Label/label";
import TransitionModal from "@/components/atoms/TransitionModal/tempModal";
import InputField from "@/components/molecules/InputField/inputField";
import TextareaField from "@/components/molecules/TextareaField/TextareaField";
import useResidentsByCondoId from "@/hooks/queries/residents/useResidentsByCondoId";
import { errorToast, successToast } from "@/hooks/useAppToast";
import useAuth from "@/hooks/useAuth";
import { queryClient } from "@/store/providers/queryClient";
import { createFirestoreDoc, updateFirestoreDoc } from "@/store/services";
import {
  deleteFile,
  deleteImage,
  uploadFile,
  uploadImage
} from "@/store/services/firebaseStorage";
import { sendNotification } from "@/store/services/notification";
import { storageGet } from "@/store/services/storage";
import { extractFilename } from "@/utils/extractFilename";
import AddWarningSchema from "@/validations/aptManager/AddWarning";

import { CreateAssemblyModalProps } from "./types";

type AddWarningForm = z.infer<typeof AddWarningSchema>;

const CreateAssemblyModal = ({
  readOnly,
  isOpen,
  onOpenChange,
  assemblyData
}: CreateAssemblyModalProps) => {
  const condoId = storageGet<string>("condoId");
  const inputUpload = useRef<HTMLInputElement | null>(null);
  const fileInputUpload = useRef<HTMLInputElement | null>(null);
  const { userUid } = useAuth();
  const [image, setImage] = useState<File | string | null>(null);
  const [file, setFile] = useState<File | string | null>(null);
  const [loading, setLoading] = useState(false);
  const { data: residents } = useResidentsByCondoId(condoId as string);

  const {
    handleSubmit,
    register,
    formState: { errors },
    reset
  } = useForm<AddWarningForm>({
    mode: "all",
    criteriaMode: "all",
    resolver: zodResolver(AddWarningSchema),
    values: {
      title: assemblyData?.about ?? "",
      description: assemblyData?.text ?? ""
    }
  });

  const handleForm = async (data: AddWarningForm) => {
    if (!condoId) return;
    if (!image) {
      return errorToast("Adicione uma imagem.");
    }
    if (!file) {
      return errorToast("Adicione arquivo.");
    }
  
    setLoading(true);
  
    // Função de upload para a imagem
    const uploadImageIfNeeded = async () => {
      if (typeof image !== "string" && !!image) {
        const { image: url, error: errorUpload } = await uploadImage(image as File);
        if (errorUpload || !url) {
          throw new Error("Não foi possível fazer upload da imagem.");
        }
        // Deleta a imagem antiga, se estiver editando
        if (assemblyData?.image) {
          await deleteImage(assemblyData.image);
        }
        return url;
      }
      return assemblyData?.image ?? null; // Retorna a imagem existente se não houver novo upload
    };
  
    // Função de upload para o arquivo
    const uploadFileIfNeeded = async () => {
      if (typeof file !== "string" && !!file) {
        const { fileUrl: url, error: errorUpload } = await uploadFile(file as File);
        if (errorUpload || !url) {
          throw new Error("Não foi possível fazer upload do arquivo.");
        }
        // Deleta o arquivo antigo, se estiver editando
        if (assemblyData?.meetingFileUrl) {
          await deleteFile(assemblyData.meetingFileUrl);
        }
        return url;
      }
      return assemblyData?.meetingFileUrl ?? null; // Retorna o arquivo existente se não houver novo upload
    };
  
    try {
      // Executa os uploads de imagem e arquivo em paralelo
      const [imageUrl, fileUrl] = await Promise.all([
        uploadImageIfNeeded(),
        uploadFileIfNeeded(),
      ]);
  
      const finalData: Partial<CondoAssembly> = {
        about: data.title,
        text: data.description,
        image: imageUrl as string,
        meetingFileUrl: fileUrl as string,
        condominiumId: condoId as string,
        creatorId: userUid,
      };
  
      // Criação ou atualização do documento no Firestore
      if (!assemblyData) {
        await createFirestoreDoc<Omit<CondoAssembly, "id">>({
          collectionPath: `condoAssemblies`,
          data: {
            ...finalData,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now(),
          } as CondoAssembly,
        });
        await sendNotification({
          content: `Ata de reunião do dia ${new Date().toLocaleDateString()} já disponível`,
          title: "Ata disponível!",
          date: null,
          type: "survey",
          users: (residents ?? []).map((resident) => ({
            tokens: resident?.tokens ?? [],
            userId: resident?.id ?? "",
          })),
        });
        successToast("Nova assembleia adicionada.");
      } else {
        await updateFirestoreDoc({
          documentPath: `/condoAssemblies/${assemblyData.id}`,
          data: {
            ...finalData,
            updatedAt: Timestamp.now(),
          } as CondoAssembly,
        });
        successToast("Assembleia editada com sucesso!");
      }
  
      queryClient.invalidateQueries(["condoAssemblies", condoId]);
      reset();
      setImage(null);
      setFile(null);
      onOpenChange(false);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
      errorToast(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    if (assemblyData && assemblyData.image && !image) {
      setImage(assemblyData.image);
    }
    if (assemblyData && assemblyData.meetingFileUrl && !file) {
      setFile(assemblyData.meetingFileUrl);
    }
  }, [assemblyData, image, file]);

  return (
    <TransitionModal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title="Nova Assembleia"
      description="Insira as informações da assembleia"
      confirmBtn={
        !readOnly && (
          <Button
            variant="icon"
            size="lg"
            className=" w-[210px] bg-[#202425]"
            loading={loading}
            onClick={handleSubmit(handleForm)}
          >
            {assemblyData ? "Salvar " : "Registrar"}
          </Button>
        )
      }
      cancelBtn={
        !readOnly && (
          <Button
            onClick={() => {
              reset();
              setImage(null);
              onOpenChange(false);
            }}
            type="button"
            variant="outline-black"
            size="lg"
            className="w-[210px] text-sm"
          >
            Cancelar
          </Button>
        )
      }
    >
      <form
        onSubmit={handleSubmit(handleForm)}
        className={`flex flex-col gap-y-4 ${readOnly && " opacity-50"}`}
      >
        <InputField
          formErrors={errors}
          disabled={readOnly}
          name="title"
          className={inputClassName}
          label="Título"
          register={register}
          placeholder="Digite aqui"
        />
        <TextareaField
          disabled={readOnly}
          formErrors={errors}
          name="description"
          className={inputClassName}
          label="Descricão"
          formRegister={register}
          placeholder="Digite aqui"
        />
        <div className="flex flex-col gap-1">
          <Label>Imagem </Label>
          <input
            type="file"
            disabled={readOnly}
            ref={inputUpload}
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const currentFile = e.target.files?.[0];
              if (currentFile) {
                setImage(currentFile);
              }
            }}
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
              <>
                {readOnly ? (
                  <Link
                    target="_blank"
                    href={
                      typeof image === "string"
                        ? image
                        : URL.createObjectURL(image)
                    }
                  >
                    <Image
                      src={
                        typeof image === "string"
                          ? image
                          : URL.createObjectURL(image)
                      }
                      fill
                      alt="Imagem do assembleia"
                      className="object-contain"
                    />
                  </Link>
                ) : (
                  <Image
                    src={
                      typeof image === "string"
                        ? image
                        : URL.createObjectURL(image)
                    }
                    fill
                    alt="Imagem do assembleia"
                    className="object-contain"
                  />
                )}
              </>
            ) : (
              <strong>Clique para fazer upload</strong>
            )}
          </button>
        </div>
        <div className="flex flex-col gap-1">
          <Label>Arquivo </Label>
          <input
            type="file"
            disabled={readOnly}
            ref={fileInputUpload}
            accept=".pdf,.doc,.docx,.txt,.rtf,.odt"
            className="hidden"
            onChange={(e) => {
              const currentFile = e.target.files?.[0];
              if (currentFile) {
                setFile(currentFile);
              }
            }}
          />

          <button
            type="button"
            onClick={() => fileInputUpload?.current?.click()}
            className={twMerge(
              "relative flex h-[130px] w-full items-center justify-center gap-1 overflow-hidden rounded-sm border border-gray-300 px-3 text-sm text-black/50 outline-none transition-all hover:opacity-60",
              inputClassName
            )}
          >
            {file ? (
              <Link
                href={
                  typeof file === "string" ? file : URL.createObjectURL(file)
                }
                target="_blank"
              >
                {typeof file === "string"
                  ? extractFilename(file)
                  : URL.createObjectURL(file)}
              </Link>
            ) : (
              <strong>Clique para fazer upload</strong>
            )}
          </button>
        </div>
      </form>
    </TransitionModal>
  );
};

export default CreateAssemblyModal;
