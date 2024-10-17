"use client";
import React, { useRef, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { isCNPJ, isCPF } from "brazilian-values";
import { Timestamp } from "firebase/firestore";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { twMerge } from "tailwind-merge";
import { v7 as uuid, v4 as uuidV4 } from "uuid";

import { brazilStates } from "@/common/constants/brazilStates";
import { maritalStatusOptions } from "@/common/constants/maritalStatusOptions";
import { AptManagerEntity } from "@/common/entities/aptManager";
import { BrazilStatesOptionsType } from "@/common/entities/common/brazilStatesOptionsType";
import { MaritalStatusOptionsType } from "@/common/entities/common/maritalStatusOptionsType";
import { CompanyEntity } from "@/common/entities/company";
import Button from "@/components/atoms/Button/button";
import Label from "@/components/atoms/Label/label";
import TitleAtom from "@/components/atoms/TitleAtom/TitleAtom";
import InputField from "@/components/molecules/InputField/inputField";
import { errorToast, successToast } from "@/hooks/useAppToast";
import { queryClient } from "@/store/providers/queryClient";
import { setFirestoreDoc } from "@/store/services";
import { createUserAuth } from "@/store/services/auth";
import { sendEmail } from "@/store/services/email";
import { uploadImage } from "@/store/services/firebaseStorage";
import unmask from "@/utils/unmask";
import unmaskCurrency from "@/utils/unmaskCurrency";
import AddCompanySchema from "@/validations/admin/AddCompany";

import AddressInputs from "./components/AddressInputs";
import AptManagerInputs from "./components/AptManagerInputs/AptManagerInputs";
import { AddCompanyForm } from "./types";

const inputClassName = "border-[#DEE2E6] bg-[#F8F9FA]";

const NewCompany = () => {
  const router = useRouter();

  const {
    handleSubmit,
    register,
    control,
    watch,
    formState: { errors },
    reset,
    setValue
  } = useForm<AddCompanyForm>({
    mode: "all",
    criteriaMode: "all",
    resolver: zodResolver(AddCompanySchema),
    defaultValues: {
      setupValue: "",
      monthValue: ""
    }
  });
  const [loading, setLoading] = useState(false);

  const handleForm = async (data: AddCompanyForm) => {
    if (!isCNPJ(unmask(data.cnpj))) {
      return errorToast("CNPJ não é válido.");
    }

    if (!isCPF(unmask(data.ownerBasicInfo.cpf))) {
      return errorToast("CPF não é válido.");
    }

    if (!image) {
      return errorToast("Adicione uma imagem da empresa.");
    }

    setLoading(true);

    const password = uuidV4().slice(0, 8);
    const companyId = uuid();

    const { error: errorEmail } = await sendEmail(data.ownerEmail, password);

    if (errorEmail) {
      setLoading(false);
      return errorToast(
        "Não foi possível enviar email com credenciais, entre em contato."
      );
    }

    const { error, uid: aptManagerId } = await createUserAuth(
      data.ownerEmail,
      password
    );

    if (error || !aptManagerId) {
      setLoading(false);
      return errorToast(error ?? "Algo deu errado.");
    }

    let imageUrl = "";
    const { image: imageUploaded, error: errorUpload } =
      await uploadImage(image);

    if (errorUpload || !imageUploaded) {
      setLoading(false);
      return errorToast(
        "Não foi possível fazer upload de imagem, entrar em contato."
      );
    }
    imageUrl = imageUploaded;

    const aptManagerData = {
      companyId,
      role: "aptManager" as const,
      name: data.ownerBasicInfo.name,
      email: data.ownerEmail,
      cpf: unmask(data.ownerBasicInfo.cpf),
      rg: unmask(data.ownerBasicInfo.rg),
      emitter: data.ownerBasicInfo.emitter,
      profession: data.ownerBasicInfo.profession,
      maritalStatus: maritalStatusOptions.find(
        (item) => item.value === data.ownerBasicInfo.maritalStatus
      )?.label as MaritalStatusOptionsType,
      address: data.ownerAddressData.address,
      neighborhood: data.ownerAddressData.neighborhood,
      state: brazilStates.find(
        (item) => item.value === data.ownerAddressData.state
      )?.label as BrazilStatesOptionsType,
      number: data.ownerAddressData.number,
      cep: unmask(data.ownerAddressData.cep),
      city: data.ownerAddressData.city
    };

    await setFirestoreDoc<AptManagerEntity>({
      docPath: `users/${aptManagerId}`,
      data: aptManagerData
    });

    const companyData = {
      aptManagerId,
      name: data.name,
      image: imageUrl,
      cnpj: unmask(data.cnpj),
      address: data.addressData.address,
      neighborhood: data.addressData.neighborhood,
      state: brazilStates.find(
        (item) => item.value === data.ownerAddressData.state
      )?.label as BrazilStatesOptionsType,
      number: data.addressData.number,
      cep: unmask(data.addressData.cep),
      city: data.addressData.city,
      setupValue: parseInt(unmaskCurrency(data.setupValue)),
      monthValue: parseInt(unmaskCurrency(data.monthValue)),
      finder: data.finder ?? null,
      createdAt: Timestamp.now(),
      endedAt: null
    };
    await setFirestoreDoc<CompanyEntity>({
      docPath: `companies/${companyId}`,
      data: companyData
    });

    successToast(
      "Nova empresa adicionada. Peça pra responsável legal acessar o email."
    );
    setLoading(false);
    queryClient.invalidateQueries(["companies", "activeCompanies"]);
    reset();
    setImage(null);
    router.push("/admin");
  };

  const inputUpload = useRef<HTMLInputElement | null>(null);
  const [image, setImage] = useState<File | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
    }
  };

  return (
    <form
      className="mx-auto mb-40  block w-11/12 max-w-[885px] space-y-8"
      onSubmit={handleSubmit(handleForm)}
    >
      <div className="space-y-4 ">
        <TitleAtom className="text-center"> Nova Empresa</TitleAtom>

        <div className="mt-4 grid grid-cols-1 gap-x-2 gap-y-4 sm:grid-cols-2">
          <div className="flex flex-col justify-between gap-y-4 sm:gap-y-0">
            <InputField
              formErrors={errors}
              name="name"
              className={inputClassName}
              label="Nome da empresa"
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
            <Label>Imagem da empresa </Label>
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
                  src={URL.createObjectURL(image)}
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

        <AddressInputs
          control={control}
          inputClassName={inputClassName}
          register={register}
          formErrors={errors}
          zodObj="addressData"
          setValue={setValue}
          watchCep={unmask(watch("addressData.cep") ?? "")}
        />
        <InputField
          name="setupValue"
          className={inputClassName}
          label="Valor do Setup"
          register={register}
          formErrors={errors}
          currency
          control={control}
          placeholder="Digite o valor"
        />
        <InputField
          name="monthValue"
          className={inputClassName}
          label="Valor Mensal"
          register={register}
          formErrors={errors}
          currency
          control={control}
          placeholder="Digite o valor"
        />
        <InputField
          formErrors={errors}
          name="finder"
          className={inputClassName}
          label="Finder"
          register={register}
          placeholder="Digite o nome da pessoa que possibilitou o contato com MyRoofs"
        />
      </div>

      <div className="space-y-4">
        <TitleAtom className="text-center"> Responsável Legal </TitleAtom>
        <AptManagerInputs<AddCompanyForm>
          setValue={setValue}
          errors={errors}
          register={register}
          control={control}
          watch={watch}
        />
      </div>

      <Button
        variant="icon"
        size="md"
        className="mx-auto mt-16 w-[180px] bg-[#202425]"
        type="submit"
        loading={loading}
      >
        Registrar
      </Button>
    </form>
  );
};

export default NewCompany;
