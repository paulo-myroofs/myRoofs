import { useEffect, useRef, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Timestamp } from "firebase/firestore";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { twMerge } from "tailwind-merge";
import { z } from "zod";

import { inputClassName } from "@/app/contants";
import { CondoNoticeEntity } from "@/common/entities/notices/condoNotices";
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
import { deleteImage, uploadImage } from "@/store/services/firebaseStorage";
import { sendNotification } from "@/store/services/notification";
import { storageGet } from "@/store/services/storage";
import AddWarningSchema from "@/validations/aptManager/AddWarning";

import { CreateCondoWarningModalProps } from "./types";

type AddWarningForm = z.infer<typeof AddWarningSchema>;

const CreateCondoWarningModal = ({
  isOpen,
  onOpenChange,
  noticeData,
  readOnly = false
}: CreateCondoWarningModalProps) => {
  const inputUpload = useRef<HTMLInputElement | null>(null);
  const { userUid } = useAuth();
  const condoId = storageGet<string>("condoId");
  const [image, setImage] = useState<File | string | null>(null);
  const { data: residents } = useResidentsByCondoId(condoId as string);
  const [loading, setLoading] = useState(false);

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
      title: noticeData?.about ?? "",
      description: noticeData?.text ?? ""
    }
  });

  const handleForm = async (data: AddWarningForm) => {
    if (!condoId) return;
    if (!image) {
      return errorToast("Adicione uma imagem.");
    }

    setLoading(true);

    let imageUrl = noticeData?.image ?? undefined;
    if (typeof image !== "string" && !!image) {
      const { image: url, error: errorUpload } = await uploadImage(
        image as File
      );

      if (errorUpload || !url) {
        setLoading(false);
        return errorToast(
          "Não foi possível fazer upload de imagem, entrar em contato."
        );
      }
      imageUrl = url;

      if (noticeData && noticeData.image) {
        // is editting
        await deleteImage(noticeData.image);
      }
    }

    const finalData: Partial<CondoNoticeEntity> = {
      about: data.title,
      text: data.description,
      image: imageUrl,
      condominiumId: condoId as string,
      creatorId: userUid
    };

    if (!noticeData) {
      await createFirestoreDoc<Omit<CondoNoticeEntity, "id">>({
        collectionPath: `condoNotices`,
        data: {
          ...finalData,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now()
        } as CondoNoticeEntity
      });
      await sendNotification({
        content: `Alerta: ${data.title}`,
        title: "Alerta!",
        date: null,
        type: "alert",
        users: (residents ?? []).map((resident) => ({
          tokens: resident?.tokens ?? [],
          userId: resident?.id ?? ""
        }))
      });

      successToast("Novo aviso de condomínio adicionado.");
    } else {
      await updateFirestoreDoc({
        documentPath: `/condoNotices/${noticeData.id}`,
        data: {
          ...finalData,
          updatedAt: Timestamp.now()
        } as CondoNoticeEntity
      });
      queryClient.invalidateQueries(["condoNotices", condoId]);
      successToast("Aviso editado com sucesso!");
    }

    setLoading(false);
    queryClient.invalidateQueries(["condoNotices", condoId]);
    reset();
    setImage(null);
    onOpenChange(false);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const currentFile = e.target.files?.[0];
    if (currentFile) {
      setImage(currentFile);
    }
  };

  useEffect(() => {
    if (noticeData && noticeData.image && !image) {
      setImage(noticeData.image);
    }
  }, [noticeData, image]);

  return (
    <TransitionModal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title="Nova Aviso"
      description="Insira as informações do aviso"
      confirmBtn={
        !readOnly && (
          <Button
            variant="icon"
            size="lg"
            className=" w-[210px] bg-[#202425]"
            loading={loading}
            onClick={handleSubmit(handleForm)}
          >
            {noticeData ? "Editar " : "Registrar"}
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
          name="title"
          className={inputClassName}
          disabled={readOnly}
          label="Título"
          register={register}
          placeholder="Digite aqui"
        />
        <TextareaField
          formErrors={errors}
          name="description"
          className={inputClassName}
          label="Descricão"
          disabled={readOnly}
          formRegister={register}
          placeholder="Digite aqui"
        />
        <div className="flex flex-col gap-1">
          <Label>Imagem </Label>
          <input
            type="file"
            ref={inputUpload}
            disabled={readOnly}
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
                      alt="Imagem do aviso"
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
                    alt="Imagem do aviso"
                    className="object-contain"
                  />
                )}
              </>
            ) : (
              <strong>Clique para fazer upload</strong>
            )}
          </button>
        </div>
      </form>
    </TransitionModal>
  );
};

export default CreateCondoWarningModal;
