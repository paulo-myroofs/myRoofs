import React, { useRef, useState } from "react";

import Image from "next/image";
import Link from "next/link";
import { twMerge } from "tailwind-merge";

import { inputClassName } from "@/app/contants";
import Button from "@/components/atoms/Button/button";
import Label from "@/components/atoms/Label/label";
import TransitionModal from "@/components/atoms/TransitionModal/tempModal";
import { usePropaganda } from "@/hooks/queries/propaganda/usePropaganda";
import { errorToast } from "@/hooks/useAppToast";
import { uploadImage } from "@/store/services/firebaseStorage";

import { EditPropagandaProps } from "./types";

export const PropagaModal: React.FC<EditPropagandaProps> = ({
  isOpen,
  onOpenChange,
  condoId
}) => {
  const inputUpload = useRef<HTMLInputElement | null>(null);
  const [image, setImage] = useState<File | string | null>(null);

  const { propagandas, loading, savePropaganda } = usePropaganda(condoId);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const currentFile = e.target.files?.[0];
    if (currentFile) {
      setImage(currentFile);
    }
  };

  const handleSave = async () => {
    if (!image) {
      return errorToast("Adicione uma imagem.");
    }

    try {
      let imageUrl = "";

      if (image instanceof File) {
        const { image: uploadedImageUrl, error: uploadError } =
          await uploadImage(image);
        if (uploadError || !uploadedImageUrl) {
          return;
        }
        imageUrl = uploadedImageUrl;
      } else {
        imageUrl = image;
      }

      await savePropaganda(imageUrl);
      setImage(null);
      onOpenChange(false);
    } catch (error) {
      console.error("Error saving propaganda:", error);
    }
  };

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
          onClick={() => {
            if (!loading) handleSave();
          }}
        >
          Confirmar
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
        <div className="grid grid-cols-2 gap-4">
          {propagandas?.map((propaganda) => (
            <div key={propaganda.id} className="relative">
              <Image
                src={propaganda.imageUrl}
                alt="Banner"
                width={200}
                height={100}
                className="object-cover"
              />
            </div>
          ))}
        </div>

        <Label>Adicionar Nova Imagem</Label>
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
                  typeof image === "string" ? image : URL.createObjectURL(image)
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
                  typeof image === "string" ? image : URL.createObjectURL(image)
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
