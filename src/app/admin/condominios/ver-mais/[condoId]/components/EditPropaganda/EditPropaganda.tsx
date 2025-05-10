import React, { useRef, useState } from "react";

import Image from "next/image";
import { twMerge } from "tailwind-merge";

import { inputClassName } from "@/app/contants";
import Button from "@/components/atoms/Button/button";
import Label from "@/components/atoms/Label/label";
import TransitionModal from "@/components/atoms/TransitionModal/tempModal";
import usePropaganda from "@/hooks/queries/propaganda/usePropaganda";
import { errorToast } from "@/hooks/useAppToast";
import { uploadImage } from "@/store/services/firebaseStorage";
import { storageGet } from "@/store/services/storage";

import { EditPropagandaProps } from "./types";

export const PropagaModal: React.FC<EditPropagandaProps> = ({
  isOpen,
  onOpenChange
}) => {
  const condominiumId = storageGet<string>("condoId");

  const { propagandas, isLoading, savePropaganda, updatePropaganda } =
    usePropaganda(condominiumId as string);

  const inputUpload = useRef<HTMLInputElement>(null);
  const [image, setImage] = useState<File | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const handleImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    index?: number
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const { image: uploadedImageUrl, error } = await uploadImage(file);
      if (error || !uploadedImageUrl) {
        throw new Error(error?.toString() || "Erro no upload");
      }

      if (index !== undefined) {
        await updatePropaganda(index, uploadedImageUrl);
        setEditingIndex(null);
      } else {
        setImage(file);
      }
    } catch (error) {
      console.error("Erro ao processar imagem:", error);
      errorToast("Erro ao processar imagem. Tente novamente.");
    } finally {
      if (inputUpload.current) {
        inputUpload.current.value = "";
      }
    }
  };

  const handleSave = async () => {
    if (!image) {
      return errorToast("Selecione uma imagem");
    }

    try {
      const { image: uploadedImageUrl, error } = await uploadImage(image);
      if (error || !uploadedImageUrl) {
        throw new Error(error?.toString() || "Erro no upload");
      }

      await savePropaganda(uploadedImageUrl);
      setImage(null);
      onOpenChange(false);
    } catch (error) {
      console.error("Erro ao salvar:", error);
      errorToast("Erro ao salvar propaganda.");
    }
  };

  return (
    <TransitionModal
      isOpen={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          setImage(null);
          setEditingIndex(null);
        }
        onOpenChange(open);
      }}
      title="Gerenciar Publicidade"
      description="Escolha os 4 banners que deseja adicionar"
      confirmBtn={
        <Button
          variant="icon"
          size="lg"
          className="w-[210px] bg-[#202425]"
          loading={isLoading}
          onClick={handleSave}
        >
          Confirmar
        </Button>
      }
      cancelBtn={
        <Button
          type="button"
          variant="outline-black"
          size="lg"
          className="w-[210px] text-sm"
          onClick={() => onOpenChange(false)}
        >
          Cancelar
        </Button>
      }
    >
      <div className="flex flex-col gap-4">
        <div>
          <Label>Imagens Atuais</Label>
          <div className="mt-2 grid grid-cols-2 gap-4">
            {propagandas?.map((prop: { imageUrl: string }, index: number) => (
              <div key={index} className="group relative h-32">
                <Image
                  src={prop.imageUrl}
                  alt="Banner"
                  fill
                  className="rounded object-cover"
                />
                <button
                  type="button"
                  onClick={() => {
                    setEditingIndex(index);
                    inputUpload.current?.click();
                  }}
                  className="absolute inset-0 flex items-center justify-center bg-black/50 text-white opacity-0 transition-opacity group-hover:opacity-100"
                >
                  Editar
                </button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <Label>Adicionar Nova Imagem</Label>
          <button
            type="button"
            onClick={() => inputUpload.current?.click()}
            className={twMerge(
              "relative flex h-32 w-full items-center justify-center rounded border border-dashed border-gray-300",
              inputClassName
            )}
          >
            {image ? (
              <Image
                src={URL.createObjectURL(image)}
                alt="Pré-visualização"
                fill
                className="object-contain p-2"
              />
            ) : (
              <span className="text-gray-500">Clique para enviar</span>
            )}
          </button>
        </div>

        <input
          type="file"
          ref={inputUpload}
          accept="image/*"
          className="hidden"
          onChange={(e) => handleImageChange(e, editingIndex ?? undefined)}
        />
      </div>
    </TransitionModal>
  );
};
