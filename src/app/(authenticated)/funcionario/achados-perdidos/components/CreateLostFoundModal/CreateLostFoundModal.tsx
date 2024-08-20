import { useEffect, useRef, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Timestamp } from "firebase/firestore";
import Image from "next/image";
import { Controller, useForm } from "react-hook-form";
import { twMerge } from "tailwind-merge";
import { z } from "zod";

import { inputClassName } from "@/app/contants";
import { EmployeeEntity } from "@/common/entities/employee";
import { LostFound } from "@/common/entities/lostAndFound";
import Button from "@/components/atoms/Button/button";
import { DatePicker } from "@/components/atoms/DatePicker/DatePicker";
import FormErrorLabel from "@/components/atoms/FormError/formError";
import Label from "@/components/atoms/Label/label";
import TransitionModal from "@/components/atoms/TransitionModal/tempModal";
import InputField from "@/components/molecules/InputField/inputField";
import useProfile from "@/hooks/queries/useProfile";
import { errorToast, successToast } from "@/hooks/useAppToast";
import useAuth from "@/hooks/useAuth";
import { queryClient } from "@/store/providers/queryClient";
import {
  createFirestoreDoc,
  deleteFirestoreDoc,
  updateFirestoreDoc
} from "@/store/services";
import { deleteImage, uploadImage } from "@/store/services/firebaseStorage";
import { timestampToDate } from "@/utils/timestampToDate";
import AddLostFoundDataSchema from "@/validations/employee/AddLostFoundData";

import { CreateLostFoundModalProps } from "./types";

type AddLostFoundDataForm = z.infer<typeof AddLostFoundDataSchema>;

const CreateLostFoundModal = ({
  isOpen,
  onOpenChange,
  lostFoundData
}: CreateLostFoundModalProps) => {
  const { userUid } = useAuth();
  const { data: user } = useProfile<EmployeeEntity>(userUid);
  const condoId = user?.condominiumCode;
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<File | string | null>(null);
  const inputUpload = useRef<HTMLInputElement | null>(null);

  const {
    handleSubmit,
    control,
    register,
    formState: { errors },
    reset
  } = useForm<AddLostFoundDataForm>({
    mode: "all",
    criteriaMode: "all",
    resolver: zodResolver(AddLostFoundDataSchema),
    defaultValues: {
      date: lostFoundData?.date
        ? timestampToDate(lostFoundData.date)
        : new Date(),
      description: lostFoundData?.description ?? "",
      foundAt: lostFoundData?.foundLocal ?? ""
    }
  });

  const handleForm = async (data: AddLostFoundDataForm) => {
    if (!condoId) return;

    setLoading(true);

    let imageUploaded = lostFoundData?.imageUrl ?? "";

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
      imageUploaded = url;

      if (lostFoundData && lostFoundData.imageUrl) {
        // is editting
        await deleteImage(lostFoundData.imageUrl);
      }
    }

    const finalData: Omit<LostFound, "id"> = {
      condominiumId: condoId,
      date: Timestamp.fromDate(data.date),
      foundLocal: data.foundAt,
      description: data.description,
      imageUrl: imageUploaded,
      deliveredTo: lostFoundData?.deliveredTo ?? null
    };

    if (lostFoundData) {
      await updateFirestoreDoc<Omit<LostFound, "id">>({
        documentPath: `/lost-and-found/${lostFoundData.id}`,
        data: finalData
      });
      successToast("Objeto editado com sucesso.");
    } else {
      await createFirestoreDoc<Omit<LostFound, "id">>({
        collectionPath: `lost-and-found`,
        data: finalData
      });
      successToast("Novo objeto adicionado.");
    }

    setLoading(false);
    queryClient.invalidateQueries(["lostFound", condoId]);
    reset();
    onOpenChange(false);
  };

  const handleDelete = async () => {
    if (!lostFoundData) return;
    setLoading(true);
    await deleteFirestoreDoc({
      documentPath: `/lost-and-found/${lostFoundData.id}`
    });
    setLoading(false);
    successToast("Encomenda removida com sucesso.");
    queryClient.invalidateQueries(["lostFound", condoId]);
    onOpenChange(false);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const currentFile = e.target.files?.[0];
    if (currentFile) {
      setImage(currentFile);
    }
  };

  useEffect(() => {
    if (lostFoundData && lostFoundData.imageUrl && !image) {
      setImage(lostFoundData.imageUrl);
    }
  }, [lostFoundData, image]);

  return (
    <TransitionModal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title="Registrar encomenda"
      description="Insira as informações necessárias para registrar a encomenda"
      confirmBtn={
        <Button
          variant="icon"
          size="lg"
          className=" w-[210px] bg-[#202425]"
          loading={loading}
          onClick={handleSubmit(handleForm)}
        >
          {!lostFoundData ? "Confirmar" : "Editar"}
        </Button>
      }
      cancelBtn={
        <Button
          onClick={() => {
            reset();
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
        {lostFoundData && (
          <button
            type="button"
            onClick={handleDelete}
            className="absolute right-5 top-5 transition-all hover:scale-110"
          >
            <Image
              src={"/icons/commonArea/trash.svg"}
              width={30}
              height={30}
              alt="Icon de remoção"
            />
          </button>
        )}

        <InputField
          formErrors={errors}
          name="description"
          className={inputClassName}
          label="Descrição"
          register={register}
          placeholder="Digite aqui"
        />
        <InputField
          formErrors={errors}
          name="foundAt"
          className={inputClassName}
          label="Encontrado em"
          register={register}
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
          <Label>Imagem </Label>
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
                  typeof image === "string" ? image : URL.createObjectURL(image)
                }
                fill
                alt="Imagem do aviso"
                className="object-contain"
              />
            ) : (
              <strong>Clique para fazer upload</strong>
            )}
          </button>
        </div>
      </form>
    </TransitionModal>
  );
};

export default CreateLostFoundModal;
