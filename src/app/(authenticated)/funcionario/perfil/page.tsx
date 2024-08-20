"use client";
import React, { useEffect, useRef, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Timestamp } from "firebase/firestore";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { twMerge } from "tailwind-merge";
import { z } from "zod";

import { inputClassName } from "@/app/contants";
import { EmployeeEntity } from "@/common/entities/employee";
import Button from "@/components/atoms/Button/button";
import InputField from "@/components/molecules/InputField/inputField";
import useProfile from "@/hooks/queries/useProfile";
import { errorToast } from "@/hooks/useAppToast";
import useAuth from "@/hooks/useAuth";
import { queryClient } from "@/store/providers/queryClient";
import { updateFirestoreDoc } from "@/store/services";
import { uploadImage, deleteImage } from "@/store/services/firebaseStorage";
import formatToPhoneMask from "@/utils/formatToPhoneMask";
import unmask from "@/utils/unmask";
import EditEmployeeSchema from "@/validations/aptManager/AddEmployee";

type EditEmployeeForm = z.infer<typeof EditEmployeeSchema>;

const Perfil = () => {
  const { userUid } = useAuth();
  const { data: profile } = useProfile<EmployeeEntity>(userUid);
  const inputUpload = useRef<HTMLInputElement | null>(null);
  const [image, setImage] = useState<File | string | null>();
  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    handleSubmit,
    register,
    formState: { errors },
    reset
  } = useForm<EditEmployeeForm>({
    mode: "all",
    criteriaMode: "all",
    resolver: zodResolver(EditEmployeeSchema),
    values: {
      name: profile?.name ?? "",
      email: profile?.email ?? "",
      address: profile?.address ?? "",
      occupation: profile?.occupation ?? "",
      phone: profile?.phone ? formatToPhoneMask(profile.phone) : "",
      cpf: profile?.cpf ?? ""
    }
  });

  const handleForm = async (data: EditEmployeeForm) => {
    setLoading(true);
    let imageUrl = profile?.image ?? null;
    if (typeof image !== "string" && !!image) {
      const { image: url, error: errorUpload } = await uploadImage(image);

      if (errorUpload || !url) {
        errorToast(
          "Não foi possível fazer upload de imagem, entrar em contato."
        );
      }

      imageUrl = url;
      if (isEdit && profile?.image) {
        await deleteImage(profile.image); // just uploaded the new one in line above
      }
    }
    if (profile?.image && !image && isEdit) {
      await deleteImage(profile.image);
    }

    const finalData = {
      image: imageUrl,
      name: data.name,
      phone: unmask(data.phone),
      cpf: data.cpf,
      occupation: data.occupation,
      address: data.address,
      updatedAt: Timestamp.now()
    } as Partial<EmployeeEntity>;

    await updateFirestoreDoc({
      documentPath: `users/${userUid}`,
      data: finalData
    });
    setLoading(false);
    setIsEdit(false);
    queryClient.invalidateQueries(["profile", userUid]);
    reset();
    setImage(undefined);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
    }
  };

  useEffect(() => {
    if (profile && profile.image && !image) {
      setImage(profile.image);
    }
  }, [profile, image]);

  return (
    <section className="mx-auto flex w-11/12 max-w-[600px] flex-col items-center gap-y-8">
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
          `relative flex h-[150px] w-[150px] items-center justify-center gap-1 overflow-hidden rounded-full border border-gray-300 px-3 text-sm text-black/50 outline-none transition-all hover:opacity-60 ${!isEdit && "pointer-events-none opacity-70"}`,
          inputClassName
        )}
      >
        {image ? (
          <Image
            src={typeof image === "string" ? image : URL.createObjectURL(image)}
            fill
            className="object-cover"
            alt="Imagem "
          />
        ) : (
          <strong className="text-sm">Clique para fazer upload</strong>
        )}
      </button>
      <form
        className={`w-full space-y-4 ${!isEdit && "pointer-events-none opacity-70"}`}
        onSubmit={handleSubmit(handleForm)}
      >
        <InputField
          className={inputClassName}
          label="Nome completo"
          name="name"
          register={register}
          formErrors={errors}
          placeholder="Digite aqui"
        />
        <InputField
          className={inputClassName}
          label="Ocupação"
          name="occupation"
          register={register}
          formErrors={errors}
          placeholder="Digite aqui"
        />{" "}
        <div className="grid grid-cols-2 gap-x-2">
          <InputField
            className={inputClassName}
            label="Telefone"
            name="phone"
            mask={"(99) 99999-9999"}
            register={register}
            formErrors={errors}
            placeholder="Digite aqui"
          />{" "}
          <InputField
            className={inputClassName}
            label="CPF"
            name="cpf"
            mask={"999.999.999-99"}
            register={register}
            formErrors={errors}
            placeholder="Digite aqui"
          />{" "}
        </div>
        <InputField
          className={inputClassName}
          label="Endereço"
          name="address"
          register={register}
          formErrors={errors}
          placeholder="Digite aqui"
        />{" "}
      </form>

      {!isEdit ? (
        <Button
          variant="basicBlack"
          type="button"
          onClick={() => setIsEdit(true)}
        >
          {" "}
          Editar{" "}
        </Button>
      ) : (
        <div className="flex justify-center gap-2">
          <Button
            variant="outline-black"
            type="button"
            onClick={() => {
              reset();
              setImage(null);
              setIsEdit(false);
            }}
          >
            {" "}
            Cancelar{" "}
          </Button>
          <Button
            variant="basicBlack"
            className=" rounded-full"
            loading={loading}
            onClick={handleSubmit(handleForm)}
          >
            {" "}
            Salvar{" "}
          </Button>
        </div>
      )}
    </section>
  );
};

export default Perfil;
