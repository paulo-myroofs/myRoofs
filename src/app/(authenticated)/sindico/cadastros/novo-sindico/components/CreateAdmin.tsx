"use client";

import { useState, useRef } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Camera } from "lucide-react";
import Image from "next/image";
import { SubmitHandler, useForm } from "react-hook-form";
import { v4 } from "uuid";
import z from "zod";

import AddressInputsModal from "@/app/admin/nova-empresa/components/AddressInputsModal";
import { brazilStates } from "@/common/constants/brazilStates";
import { AptManagerEntity } from "@/common/entities/aptManager";
import { BrazilStatesOptionsType } from "@/common/entities/common/brazilStatesOptionsType";
import Button from "@/components/atoms/Button/button";
import TransitionModal from "@/components/atoms/TransitionModal/tempModal";
import InputField from "@/components/molecules/InputField/inputField";
import { errorToast, successToast } from "@/hooks/useAppToast";
import { setFirestoreDoc, updateFirestoreDoc } from "@/store/services";
import { deleteImage, uploadImage } from "@/store/services/firebaseStorage";
// import Button from "@/components/atoms/Button/button";
import { storageGet } from "@/store/services/storage";
import AddAptManager from "@/validations/admin/AddAptManager";

import { AdminModalProps } from "./types";

type AddAptManagerForm = z.infer<typeof AddAptManager>;
const inputClassName = "border-[#DEE2E6] bg-[#F8F9FA]";

export default function AptManagerModal({
  isOpen,
  onOpenChange,
  adminData
}: AdminModalProps) {
  // const condoId = "12345";
  const condoId = storageGet<string>("condoId") as string;
  const [image, setImage] = useState<File | string | null>(
    adminData?.image ?? null
  );
  const [loading, setLoading] = useState(false);
  const {
    handleSubmit,
    register,
    control,
    watch,
    formState: { errors },
    reset,
    setValue
  } = useForm<AddAptManagerForm>({
    resolver: zodResolver(AddAptManager),
    defaultValues: {
      ownerBasicInfo: {
        name: adminData?.name ?? "",
        cpf: adminData?.cpf ?? "",
        rg: adminData?.rg ?? "",
        emitter: adminData?.emitter ?? "",
        profession: adminData?.profession ?? "",
        maritalStatus: adminData?.maritalStatus ?? ""
      },
      ownerAddressData: {
        cep: adminData?.cep ?? "",
        state:
          brazilStates.find((item) => item.label === adminData?.state)?.value ??
          "",
        city: adminData?.city ?? "",
        neighborhood: adminData?.neighborhood ?? "",
        address: adminData?.address ?? "",
        number: adminData?.number ?? ""
      },
      ownerEmail: adminData?.email ?? ""
    }
  });
  const inputUpload = useRef<HTMLInputElement | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const currentFile = e.target.files?.[0];
    if (currentFile) {
      setImage(currentFile);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleForm: SubmitHandler<AddAptManagerForm> = async (data) => {
    if (!condoId) {
      return errorToast("Não foi possível encontrar o condomínio.");
    }
    setLoading(true);

    try {
      let imageUrl = adminData?.image;
      if (typeof image === "string" && !!image) {
        const { image: url, error: errorUpload } = await uploadImage(
          image as unknown as File
        );
        if (errorUpload || !url) {
          throw new Error("Erro ao fazer upload da imagem.");
        }
        imageUrl = url;

        if (adminData && adminData.image) {
          await deleteImage(adminData.image);
        }
      }

      const newAdmin: AptManagerEntity = {
        id: adminData?.id ?? v4(),
        name: data.ownerBasicInfo.name,
        cpf: data.ownerBasicInfo.cpf,
        email: data.ownerEmail,
        image: imageUrl || "",
        address: data.ownerAddressData.address,
        number: data.ownerAddressData.number,
        cep: data.ownerAddressData.cep,
        city: data.ownerAddressData.city,
        state: data.ownerAddressData.state as BrazilStatesOptionsType,

        neighborhood: data.ownerAddressData.neighborhood,
        role: "aptManager",
        companyId: condoId,
        rg: "",
        emitter: "",
        profession: "",
        maritalStatus: "Solteiro"
      };

      if (!adminData) {
        await setFirestoreDoc<Omit<AptManagerEntity, "id">>({
          docPath: `users/${newAdmin.id}`,
          data: newAdmin
        });

        successToast("Administrador adicionado com sucesso.");
      } else {
        await updateFirestoreDoc<Omit<AptManagerEntity, "id">>({
          documentPath: `users/${adminData.id}`,
          data: newAdmin
        });
        successToast("Administrador atualizado com sucesso.");
      }

      onOpenChange(false); // Fecha o modal
      reset(); // Limpa o formulário
      setImage(null); // Limpa a imagem
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      errorToast((error as any).message || "Erro ao salvar o administrador.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <TransitionModal
      isOpen={isOpen}
      title={adminData ? "Editar Administrador" : "Novo Administrador"}
      description={
        adminData
          ? "Edite as informações do administrador"
          : "Preencha as informações para adicionar um novo administrador"
      }
      onOpenChange={onOpenChange}
      confirmBtn={
        <Button
          variant="icon"
          size="lg"
          className="w-[210px] bg-[#202425]"
          loading={loading}
          onClick={() => {
            handleSubmit(handleForm)();
            onOpenChange(false);
          }}
        >
          {adminData ? "Salvar Alterações" : "Registrar"}
        </Button>
      }
      cancelBtn={
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
      }
    >
      <div className="flex justify-between max-sm:flex-col">
        <div className="relative mb-6 flex h-[64px] w-[64px] items-center justify-center overflow-hidden rounded-full bg-gray-400 bg-cover">
          {image || adminData?.image ? (
            <Image
              className="object-cover"
              fill
              src={
                typeof image === "string"
                  ? image
                  : image instanceof File
                    ? URL.createObjectURL(image)
                    : adminData?.image || ""
              }
              alt="Imagem do administrador"
            />
          ) : (
            <Camera />
          )}
        </div>
        <div>
          <input
            type="file"
            ref={inputUpload}
            accept=".gif,.jpg,.png,.svg"
            className="hidden"
            onChange={handleImageChange}
          />
          <button
            onClick={() => inputUpload?.current?.click()}
            className="h-[74px] w-full rounded-[12px] border border-solid border-[#DEE2E6] transition-all hover:scale-[103%] sm:min-w-[362px]"
          >
            <div className="flex h-[42px] flex-col gap-1">
              <div className="flex justify-center gap-1">
                <h1 className="text-[14px] font-semibold">
                  Clique para fazer upload
                </h1>
              </div>
              <h3 className="text-center text-[12px] font-normal text-[#475467]">
                SVG, PNG, JPG or GIF (max. 800x400px)
              </h3>
            </div>
          </button>
        </div>
      </div>
      <form
        className={`flex flex-col gap-y-4`}
        onSubmit={handleSubmit(handleForm)}
      >
        <div className="w-full">
          <InputField
            formErrors={errors}
            name="ownerBasicInfo.name"
            className={inputClassName}
            label="Nome Completo"
            register={register}
            placeholder="Digite aqui"
          />
        </div>
        <div className="flex gap-3 max-sm:flex-wrap">
          <InputField
            name="ownerBasicInfo.cpf"
            className={"w-full border-[#DEE2E6] bg-[#F8F9FA]"}
            label="CPF"
            mask={"999.999.999-99"}
            register={register}
            formErrors={errors}
            placeholder="000.000.000-00"
          />
          <InputField
            name="ownerBasicInfo.rg"
            className={"w-full border-[#DEE2E6] bg-[#F8F9FA]"}
            label="RG"
            register={register}
            formErrors={errors}
            placeholder="Digite aqui"
          />
        </div>
        <div className="flex w-full gap-3 max-sm:flex-wrap">
          <InputField
            name="ownerBasicInfo.emitter"
            className={"w-full border-[#DEE2E6] bg-[#F8F9FA]"}
            label="Órgão Emissor"
            register={register}
            formErrors={errors}
            placeholder="Digite aqui"
          />
          <InputField
            name="ownerBasicInfo.profession"
            className={"w-full border-[#DEE2E6] bg-[#F8F9FA]"}
            label="Profissão"
            register={register}
            formErrors={errors}
            placeholder="Digite aqui"
          />
        </div>
        <div className="w-full">
          <InputField
            name="ownerBasicInfo.maritalStatus"
            className={"w-full border-[#DEE2E6] bg-[#F8F9FA]"}
            label="Estado Civil"
            register={register}
            formErrors={errors}
            placeholder="Selecione"
          />
        </div>
        <div className="w-full">
          <InputField
            name="ownerEmail"
            className={"w-full border-[#DEE2E6] bg-[#F8F9FA]"}
            label="Email"
            register={register}
            formErrors={errors}
            placeholder="Digite aqui"
          />
        </div>
        <div className="w-full">
          <AddressInputsModal
            control={control}
            inputClassName={inputClassName}
            register={register}
            formErrors={errors}
            zodObj="ownerAddressData"
            setValue={setValue}
            watchCep={watch("ownerAddressData.cep") ?? ""}
          />
        </div>
      </form>
    </TransitionModal>
  );
}
