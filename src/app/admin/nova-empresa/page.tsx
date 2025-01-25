"use client";
import React, { useRef, useState, useEffect } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { isCNPJ, isCPF } from "brazilian-values";
import { Timestamp } from "firebase/firestore";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { twMerge } from "tailwind-merge";
import { v7 as uuid, v4 as uuidV4 } from "uuid";

import { brazilStates } from "@/common/constants/brazilStates";
import { maritalStatusOptions } from "@/common/constants/maritalStatusOptions";
import { AptManagerEntity, Status } from "@/common/entities/aptManager";
import { BrazilStatesOptionsType } from "@/common/entities/common/brazilStatesOptionsType";
import { MaritalStatusOptionsType } from "@/common/entities/common/maritalStatusOptionsType";
import { CompanyEntity } from "@/common/entities/company";
import Button from "@/components/atoms/Button/button";
import Label from "@/components/atoms/Label/label";
import TitleAtom from "@/components/atoms/TitleAtom/TitleAtom";
import InputField from "@/components/molecules/InputField/inputField";
import useCompany from "@/hooks/queries/companies/useCompany";
import useProfile from "@/hooks/queries/useProfile";
import { errorToast, successToast } from "@/hooks/useAppToast";
import { queryClient } from "@/store/providers/queryClient";
import { setFirestoreDoc, updateFirestoreDoc } from "@/store/services";
import { createUserAuth } from "@/store/services/auth";
import { sendEmail } from "@/store/services/email";
import { uploadImage } from "@/store/services/firebaseStorage";
import formatCurrency from "@/utils/formatCurrency";
import unmask from "@/utils/unmask";
import unmaskCurrency from "@/utils/unmaskCurrency";
import AddCompanySchema from "@/validations/admin/AddCompany";

import AddressInputs from "./components/AddressInputs";
import AptManagerInputs from "./components/AptManagerInputs/AptManagerInputs";
import { AddCompanyForm } from "./types";

const inputClassName = "border-[#DEE2E6] bg-[#F8F9FA]";

const NewCompany = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const companyId = searchParams.get("companyId");
  const { data: company } = useCompany(companyId as string);
  const { data: aptManager } = useProfile<AptManagerEntity>(
    company?.aptManagerId as string
  );
  const defaultValues = {
    name: company?.name || "",
    cnpj: company?.cnpj || "",
    setupValue: company?.setupValue ? formatCurrency(company.setupValue) : "",
    monthValue: company?.monthValue ? formatCurrency(company.monthValue) : "",
    finder: company?.finder || "",
    ownerEmail: aptManager?.email || "",
    addressData: {
      address: company?.address || "",
      neighborhood: company?.neighborhood || "",
      state:
        (brazilStates.find((item) => item.label === company?.state)
          ?.value as string) || "",
      city: company?.city || "",
      number: company?.number || "",
      cep: company?.cep || ""
    },
    ownerBasicInfo: {
      name: aptManager?.name || "",
      cpf: aptManager?.cpf || "",
      rg: aptManager?.rg || "",
      emitter: aptManager?.emitter || "",
      profession: aptManager?.profession || "",
      adminRole: "Responsável Legal",
      maritalStatus:
        (maritalStatusOptions.find(
          (item) => item.label === aptManager?.maritalStatus
        )?.value as string) || ""
    },
    ownerAddressData: {
      address: aptManager?.address || "",
      neighborhood: aptManager?.neighborhood || "",
      state:
        (brazilStates.find((item) => item.label === company?.state)
          ?.value as string) || "",
      city: aptManager?.city || "",
      number: aptManager?.number || "",
      cep: aptManager?.cep || ""
    }
  };
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
    defaultValues
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (aptManager && company) {
      reset({
        name: company.name || "",
        cnpj: company.cnpj || "",
        setupValue: company.setupValue
          ? formatCurrency(company.setupValue)
          : "",
        monthValue: company.monthValue
          ? formatCurrency(company.monthValue)
          : "",
        finder: company.finder || "",
        ownerEmail: aptManager.email || "",
        addressData: {
          address: company.address || "",
          neighborhood: company.neighborhood || "",
          state:
            (brazilStates.find((item) => item.label === company.state)
              ?.value as string) || "",
          number: company.number || "",
          cep: company.cep || "",
          city: company.city || ""
        },
        ownerBasicInfo: {
          name: aptManager.name || "",
          cpf: aptManager.cpf || "",
          rg: aptManager.rg || "",
          emitter: aptManager.emitter || "",
          profession: aptManager.profession || "",
          adminRole: "Responsável Legal",
          maritalStatus:
            (maritalStatusOptions.find(
              (item) => item.label === aptManager.maritalStatus
            )?.value as string) || ""
        },
        ownerAddressData: {
          address: aptManager.address || "",
          neighborhood: aptManager.neighborhood || "",
          state:
            (brazilStates.find((item) => item.label === aptManager.state)
              ?.value as string) || "",
          number: aptManager.number || "",
          cep: aptManager.cep || "",
          city: aptManager.city || ""
        }
      });
    }
  }, [aptManager, company, reset]);

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

    let imageUrl = "";
    if (image instanceof File) {
      const { image: imageUploaded, error: errorUpload } = await uploadImage(
        image as File
      );

      if (errorUpload || !imageUploaded) {
        setLoading(false);
        return errorToast(
          "Não foi possível fazer upload de imagem, entrar em contato."
        );
      }
      imageUrl = imageUploaded;
    } else {
      imageUrl = image as string;
    }

    if (!company) {
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
        city: data.ownerAddressData.city,
        adminRole: data.ownerBasicInfo.adminRole,
        status: Status.INACTIVE
      };

      await setFirestoreDoc<AptManagerEntity>({
        docPath: `users/${aptManagerId}`,
        data: { ...aptManagerData, image: imageUrl }
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
        setupValue: parseInt(unmaskCurrency(data.setupValue)),
        monthValue: parseInt(unmaskCurrency(data.monthValue)),
        finder: data.finder ?? null,
        createdAt: Timestamp.now(),
        endedAt: null,
        city: data.addressData.city,
        blockedAt: null
      };
      await setFirestoreDoc<CompanyEntity>({
        docPath: `companies/${companyId}`,
        data: companyData
      });

      successToast(
        "Nova empresa adicionada. Peça pra responsável legal acessar o email."
      );
    } else {
      const aptManagerData = {
        companyId: company?.id,
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
      await updateFirestoreDoc<AptManagerEntity>({
        documentPath: `users/${company?.aptManagerId}`,
        data: aptManagerData
      });

      const companyData = {
        aptManagerId: company.aptManagerId,
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
        setupValue: parseInt(unmaskCurrency(data.setupValue)),
        monthValue: parseInt(unmaskCurrency(data.monthValue)),
        finder: data.finder ?? null,
        createdAt: Timestamp.now(),
        endedAt: null,
        city: data.addressData.city
      };
      await updateFirestoreDoc<CompanyEntity>({
        documentPath: `companies/${companyId}`,
        data: companyData
      });
      successToast("Empresa atualizada.");
    }
    setLoading(false);
    queryClient.invalidateQueries(["companies", "activeCompanies"]);
    queryClient.invalidateQueries(["companies", companyId]);
    queryClient.invalidateQueries(["profile", company?.aptManagerId]);
    queryClient.invalidateQueries(["users", companyId]);
    reset();
    setImage(null);
    if (!company) {
      router.push("/admin");
    }
    router.back();
  };

  const inputUpload = useRef<HTMLInputElement | null>(null);
  const [image, setImage] = useState<File | string | null>(
    company?.image ?? null
  );

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
        <TitleAtom className="text-center">
          {" "}
          {company ? "Editar Empresa" : "Nova Empresa"}
        </TitleAtom>

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
                <>
                  <Image
                    src={
                      typeof image === "string"
                        ? image
                        : URL.createObjectURL(image)
                    }
                    fill
                    sizes="440px"
                    alt="Imagem da empresa"
                    className="object-cover"
                  />
                </>
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
          emailDisabled={!!company}
        />
      </div>

      <div className="flex">
        <Button
          size="md"
          className="mx-auto mt-16 w-[180px] rounded-full"
          type="button"
          onClick={() => router.back()}
        >
          Cancelar
        </Button>
        <Button
          variant="icon"
          size="md"
          className="mx-auto mt-16 w-[180px] bg-[#202425]"
          type="submit"
          loading={loading}
        >
          {company ? "Confirmar" : "Registrar"}
        </Button>
      </div>
    </form>
  );
};

export default NewCompany;
