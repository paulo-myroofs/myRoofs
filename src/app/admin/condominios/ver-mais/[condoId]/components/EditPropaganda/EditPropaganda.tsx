import React, { useRef, useEffect } from "react";
import Button from "@/components/atoms/Button/button";
import Label from "@/components/atoms/Label/label";
import TransitionModal from "@/components/atoms/TransitionModal/tempModal";
import Image from "next/image";
import Link from "next/link";
import { twMerge } from "tailwind-merge";
import { uploadImage, deleteImage } from "@/store/services/firebaseStorage";
import { errorToast, successToast } from "@/hooks/useAppToast";
import { Timestamp } from "firebase/firestore";
import { inputClassName } from "@/app/contants";
import { useState } from "react";

import { EditPropagandaProps } from "./types";

interface NoticeModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  readOnly: boolean;
  loading: boolean;
  noticeData?: any;
  errors: any;
  register: any;
  handleSubmit: any;
  handleForm: any;
  reset: () => void;
  setImage: (image: File | null) => void;
  handleImageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  image: string | File | null;
  inputClassName?: string;
}

export const NoticeModal: React.FC<EditPropagandaProps> = ({
  isOpen,
  onOpenChange,
  noticeData,
}) => {
  const inputUpload = useRef<HTMLInputElement | null>(null);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<File | string | null>(null);

  // const handleForm = async (data: AddWarningForm) => {
  //   if (!condoId) return;
  //   if (!image) {
  //     return errorToast("Adicione uma imagem.");
  //   }

  //   setLoading(true);

  //   let imageUrl = noticeData?.image ?? undefined;
  //   if (typeof image !== "string" && !!image) {
  //     const { image: url, error: errorUpload } = await uploadImage(
  //       image as File
  //     );

  //     if (errorUpload || !url) {
  //       setLoading(false);
  //       return errorToast(
  //         "Não foi possível fazer upload de imagem, entrar em contato."
  //       );
  //     }
  //     imageUrl = url;

  //     if (noticeData && noticeData.image) {
  //       // is editting
  //       await deleteImage(noticeData.image);
  //     }
  //   }

  //   const finalData: Partial<CondoNoticeEntity> = {
  //     about: data.title,
  //     text: data.description,
  //     image: imageUrl,
  //     condominiumId: condoId as string,
  //     creatorId: userUid
  //   };

  //   if (!noticeData) {
  //     await createFirestoreDoc<Omit<CondoNoticeEntity, "id">>({
  //       collectionPath: `condoNotices`,
  //       data: {
  //         ...finalData,
  //         createdAt: Timestamp.now(),
  //         updatedAt: Timestamp.now()
  //       } as CondoNoticeEntity
  //     });
  //     await sendNotification({
  //       content: `Alerta: ${data.title}`,
  //       title: "Alerta!",
  //       date: null,
  //       type: "alert",
  //       users: (residents ?? []).map((resident) => ({
  //         tokens: resident?.tokens ?? [],
  //         userId: resident?.id ?? ""
  //       }))
  //     });

  //     successToast("Novo aviso de condomínio adicionado.");
  //   } else {
  //     await updateFirestoreDoc({
  //       documentPath: `/condoNotices/${noticeData.id}`,
  //       data: {
  //         ...finalData,
  //         updatedAt: Timestamp.now()
  //       } as CondoNoticeEntity
  //     });
  //     queryClient.invalidateQueries(["condoNotices", condoId]);
  //     successToast("Aviso editado com sucesso!");
  //   }

  //   setLoading(false);
  //   queryClient.invalidateQueries(["condoNotices", condoId]);
  //   setImage(null);
  //   onOpenChange(false);
  // };

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
      title={"Gerenciar Publicidade"}
      description={"Escolha os 4 banners que deseja adicionar"}
      confirmBtn={
        <Button
        variant="icon"
        size="lg"
        className="w-[210px] bg-[#202425]"
        loading={loading}
        >
        {noticeData ? "Editar " : "Registrar"}
        </Button>
      }
      cancelBtn={
        <Button
        onClick={() => {
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
      }
    >
      <div className="flex flex-col gap-1">
        <Label>Imagem</Label>
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
            <>
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
              
            </>
          ) : (
            <strong>Clique para fazer upload</strong>
          )}
        </button>
      </div>
    </TransitionModal>
  );
};