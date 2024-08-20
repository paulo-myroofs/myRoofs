import React, { useEffect, useMemo, useRef, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { twMerge } from "tailwind-merge";
import { v4 as uuidV4 } from "uuid";
import { z } from "zod";

import { CondoActivityEntity } from "@/common/entities/common/condo/condoActivity";
import Button from "@/components/atoms/Button/button";
import Label from "@/components/atoms/Label/label";
import InputField from "@/components/molecules/InputField/inputField";
import useCondo from "@/hooks/queries/condos/useCondo";
import { errorToast, successToast } from "@/hooks/useAppToast";
import { queryClient } from "@/store/providers/queryClient";
import { updateFirestoreDoc } from "@/store/services";
import { deleteImage, uploadImage } from "@/store/services/firebaseStorage";
import { storageGet } from "@/store/services/storage";
import AddActivitySchema from "@/validations/aptManager/AddActivity";

import AddedActivityCard from "./components/AddedActivityCard/AddedActivityCard";

const inputClassName = "border-[#DEE2E6] bg-[#F8F9FA]";
type AddActivityForm = z.infer<typeof AddActivitySchema>;

const ActivitiesSection = () => {
  const condoId = storageGet<string>("condoId");
  const { data: condo } = useCondo(condoId as string);
  const activities = useMemo(() => condo?.activities ?? [], [condo]);
  const inputUpload = useRef<HTMLInputElement | null>(null);
  const [toEditActivity, setToEditActivity] = useState<
    CondoActivityEntity | undefined
  >();
  const [image, setImage] = useState<File | string>();
  const [areInputsValid, setAreInputsValid] = useState(
    !activities || activities?.length === 0 || !!toEditActivity
  );

  const {
    handleSubmit,
    register,
    formState: { errors },
    reset
  } = useForm<AddActivityForm>({
    mode: "all",
    criteriaMode: "all",
    resolver: zodResolver(AddActivitySchema),
    values: {
      name: toEditActivity?.name ?? "",
      local: toEditActivity?.local ?? "",
      daysHours: toEditActivity?.daysHours ?? "",
      professionalName: toEditActivity?.professionalName ?? ""
    }
  });

  const handleForm = async (data: AddActivityForm) => {
    const isEdit = !!toEditActivity;
    const alreadySavedActivity = activities.find(
      (act) => act.id === toEditActivity?.id
    );

    let imageUrl = alreadySavedActivity?.image ?? null;
    if (typeof image !== "string" && !!image) {
      const { image: url, error: errorUpload } = await uploadImage(image);

      if (errorUpload || !url) {
        errorToast(
          "Não foi possível fazer upload de documento de convenção, entrar em contato."
        );
      }

      imageUrl = url;
      if (isEdit && alreadySavedActivity?.image) {
        await deleteImage(alreadySavedActivity.image); // just uploaded the new one in line above
      }
    }
    if (alreadySavedActivity?.image && !image && isEdit) {
      await deleteImage(alreadySavedActivity.image);
    }

    const finalData = {
      ...data,
      id: uuidV4(),
      image: imageUrl ?? null
    } as CondoActivityEntity;

    if (isEdit) {
      await updateFirestoreDoc({
        documentPath: `condominium/${condoId}`,
        data: {
          activities: activities.map((item) =>
            item.id === toEditActivity?.id ? finalData : item
          )
        }
      });
      setToEditActivity(undefined);
    } else {
      await updateFirestoreDoc({
        documentPath: `condominium/${condoId}`,
        data: { activities: [...activities, finalData] }
      });
    }
    queryClient.invalidateQueries(["condominium", condoId]);
    reset();
    setImage(undefined);
    setAreInputsValid(false);
  };

  const handleDeleteActivity = async (id: string) => {
    const activity = activities.find((item) => item.id === id);
    await updateFirestoreDoc({
      documentPath: `condominium/${condoId}`,
      data: {
        activities: activities.filter((item) => item.id !== id)
      }
    });
    await deleteImage(activity?.image);

    queryClient.invalidateQueries(["condominium", condoId]);
    successToast("Atividade de condomínio removida com sucesso.");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
    }
  };

  useEffect(() => {
    setAreInputsValid(
      !activities || activities?.length === 0 || !!toEditActivity
    );
  }, [activities, toEditActivity]);

  const finalActivities = toEditActivity
    ? activities?.filter((i) => i.id !== toEditActivity.id)
    : activities;

  return (
    <section className="mx-auto mt-4 max-w-[1200px] space-y-8">
      {finalActivities && finalActivities?.length !== 0 && (
        <div className="space-y-4">
          {finalActivities?.map((item) => (
            <AddedActivityCard
              key={item.name}
              activity={item}
              onEdit={() => {
                setAreInputsValid(true);
                if (item.image) {
                  setImage(item.image);
                }
                setToEditActivity(item);
              }}
              onRemove={() => handleDeleteActivity(item.id)}
            />
          ))}
          {!areInputsValid && (
            <div className="flex w-full items-center justify-end gap-x-4">
              <Button
                variant="icon"
                size="md"
                className=" w-[180px] bg-[#202425]"
                type="button"
                onClick={() => setAreInputsValid(true)}
              >
                Adicionar
              </Button>
            </div>
          )}
        </div>
      )}

      {areInputsValid && (
        <form className="space-y-4" onSubmit={handleSubmit(handleForm)}>
          <InputField
            className={inputClassName}
            label="Nome"
            name="name"
            register={register}
            formErrors={errors}
            placeholder="Digite o nome da atividade"
          />
          <InputField
            className={inputClassName}
            label="Local"
            name="local"
            register={register}
            formErrors={errors}
            placeholder="Digite o local onde ocorrerá a atividade"
          />{" "}
          <InputField
            className={inputClassName}
            label="Dias e horário"
            name="daysHours"
            register={register}
            formErrors={errors}
            placeholder="Digite data e horário (ex: Segunda e Quarta - 8:00 às 9:30)"
          />{" "}
          <InputField
            className={inputClassName}
            label="Nome do profissional"
            name="professionalName"
            register={register}
            formErrors={errors}
            placeholder="Digite o nome do(a) profissional que irá ofertar a atividade"
          />{" "}
          <div className="relative flex flex-col gap-1">
            <Label>Imagem </Label>
            <input
              type="file"
              ref={inputUpload}
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFileChange(e)}
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
                  className="object-contain"
                  alt="Imagem "
                />
              ) : (
                <strong>Clique para fazer upload</strong>
              )}
            </button>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline-black"
              size="md"
              type="button"
              onClick={() => {
                setAreInputsValid(false);
                setToEditActivity(undefined);
                reset();
                setImage(undefined);
              }}
            >
              Cancelar
            </Button>
            <Button variant={"basicBlack"} className="rounded-full">
              {" "}
              {!toEditActivity ? "Criar" : "Editar"}{" "}
            </Button>
          </div>
        </form>
      )}
    </section>
  );
};

export default ActivitiesSection;
