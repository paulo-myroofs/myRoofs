import React, { useRef, useState } from "react";

import { X } from "lucide-react";
import Image from "next/image";
import { twMerge } from "tailwind-merge";

import { inputClassName } from "@/app/contants";
import Button from "@/components/atoms/Button/button";
import Label from "@/components/atoms/Label/label";
import TransitionModal from "@/components/atoms/TransitionModal/tempModal";
import useAdvertisement from "@/hooks/queries/advertisement/useAdvertisement";
import { errorToast } from "@/hooks/useAppToast";
import { uploadImage } from "@/store/services/firebaseStorage";
import { storageGet } from "@/store/services/storage";

import { EditAdvertisementProps } from "./types";

export const AdvertisementModal: React.FC<EditAdvertisementProps> = ({
  isOpen,
  onOpenChange
}) => {
  const condominiumId = storageGet<string>("condoId");

  const {
    advertisements,
    isLoading,
    saveadvertisement,
    updateadvertisement,
    deleteadvertisement
  } = useAdvertisement(condominiumId as string);

  const inputUpload = useRef<HTMLInputElement>(null);
  const [image, setImage] = useState<File | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

  const handleImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    index?: number
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);

    try {
      const { image: uploadedImageUrl, error } = await uploadImage(file);
      if (error || !uploadedImageUrl) {
        throw new Error(error?.toString() || "Erro no upload");
      }

      if (index !== undefined) {
        await updateadvertisement(index, uploadedImageUrl);
        setEditingIndex(null);
      } else {
        setImage(file);
      }
    } catch (error) {
      console.error("Erro ao processar imagem:", error);
      errorToast("Erro ao processar imagem. Tente novamente.");
    } finally {
      setLoading(false);
      if (inputUpload.current) {
        inputUpload.current.value = "";
      }
    }
  };

  const handleSave = async () => {
    if (!image) {
      return errorToast("Selecione uma imagem");
    }

    setLoading(true);

    try {
      const { image: uploadedImageUrl, error } = await uploadImage(image);
      if (error || !uploadedImageUrl) {
        throw new Error(error?.toString() || "Erro no upload");
      }

      await saveadvertisement(uploadedImageUrl);
      setImage(null);
      onOpenChange(false);
    } catch (error) {
      console.error("Erro ao salvar:", error);
      errorToast("Erro ao salvar advertisement.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (deleteIndex === null) return;
    setLoading(true);
    try {
      await deleteadvertisement(deleteIndex);
      setDeleteIndex(null);
    } catch (error) {
      errorToast("Erro ao deletar advertisement.");
    } finally {
      setLoading(false);
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
          loading={loading || isLoading}
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
            {advertisements?.map(
              (prop: { imageUrl: string }, index: number) => (
                <div key={index} className="group relative h-32">
                  <Image
                    src={prop.imageUrl}
                    alt="Banner"
                    fill
                    className="rounded object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setDeleteIndex(index)}
                    className="absolute right-2 top-2 z-20 flex h-7 w-7 items-center justify-center rounded-full bg-gray-200/70 text-red-500 opacity-0 shadow transition-opacity hover:bg-white/100 group-hover:opacity-80"
                    disabled={loading}
                    title="Remover advertisement"
                  >
                    <X size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingIndex(index);
                      inputUpload.current?.click();
                    }}
                    className="absolute inset-0 z-10 flex items-center justify-center bg-black/50 text-white opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    Editar
                  </button>
                </div>
              )
            )}
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

        {deleteIndex !== null && (
          <TransitionModal
            isOpen={true}
            onOpenChange={(open) => {
              if (!open) setDeleteIndex(null);
            }}
            title="Remover advertisement?"
            description="Tem certeza que deseja remover esta advertisement?"
            confirmBtn={
              <Button
                variant="icon"
                size="lg"
                className="w-[120px] bg-[#202425]"
                loading={loading}
                onClick={handleDelete}
              >
                Remover
              </Button>
            }
            cancelBtn={
              <Button
                type="button"
                variant="outline-black"
                size="lg"
                className="w-[120px] text-sm"
                onClick={() => setDeleteIndex(null)}
              >
                Cancelar
              </Button>
            }
          />
        )}
      </div>
    </TransitionModal>
  );
};
