"use client";

import { useState, useRef } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { isCPF } from "brazilian-values";
import { Camera } from "lucide-react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { v4 as uuidV4, v4 } from "uuid";
import { z } from "zod";

import AptManagerData from "@/app/admin/condominios/ver-mais/[condoId]/components/AptManagerData/AptManagerData";
import AddressInputsModal from "@/app/admin/nova-empresa/components/AddressInputsModal";
import { brazilStates } from "@/common/constants/brazilStates";
import { maritalStatusOptions } from "@/common/constants/maritalStatusOptions";
import { AptManagerEntity } from "@/common/entities/aptManager";
import { BrazilStatesOptionsType } from "@/common/entities/common/brazilStatesOptionsType";
import { CondoEntity } from "@/common/entities/common/condo/condo";
import { MaritalStatusOptionsType } from "@/common/entities/common/maritalStatusOptionsType";
import Button from "@/components/atoms/Button/button";
import TransitionModal from "@/components/atoms/TransitionModal/tempModal";
import InputField from "@/components/molecules/InputField/inputField";
import { getAdministratorByCondoIdQueryKey } from "@/hooks/queries/administrator/useAdministratorsByCondoId";
import useCondo from "@/hooks/queries/condos/useCondo";
import useProfile from "@/hooks/queries/useProfile";
import { errorToast, successToast } from "@/hooks/useAppToast";
import useAuth from "@/hooks/useAuth";
import { queryClient } from "@/store/providers/queryClient";
import {
  deleteFirestoreDoc,
  setFirestoreDoc,
  updateFirestoreDoc
} from "@/store/services";
import { createUserAuth, deleteUserAuth } from "@/store/services/auth";
import { sendEmail } from "@/store/services/email";
import { deleteImage, uploadImage } from "@/store/services/firebaseStorage";
import { storageGet } from "@/store/services/storage";
import unmask from "@/utils/unmask";
import AddAptManager from "@/validations/admin/AddAptManager";

import { AdminModalProps } from "./types";

type AddAptManagerForm = z.infer<typeof AddAptManager>;
const inputClassName = "border-[#DEE2E6] bg-[#F8F9FA]";

export default function CreateAdminModal({
  isOpen,
  onOpenChange,
  adminData
}: AdminModalProps) {
  const condoId = storageGet<string>("condoId") as string;
  const { data: condo } = useCondo(condoId);
  const { userUid } = useAuth();
  const { data: user } = useProfile<AptManagerEntity>(userUid);

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

  const handleForm = async (data: AddAptManagerForm) => {
    if (!condo) return;
    if (!isCPF(unmask(data.ownerBasicInfo.cpf))) {
      return errorToast("CPF não é válido.");
    }

    setLoading(true);

    const password = uuidV4().slice(0, 8);

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
      // id: aptManagerId ?? v4(),
      companyId: user?.companyId as string,
      role: "aptManager" as const,
      name: data.ownerBasicInfo.name,
      email: data.ownerEmail,
      image: typeof image === "string" ? image : "",
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
      isSecondary: true
    };

    if (typeof image !== "string" && image) {
      const { image: url, error: errorUpload } = await uploadImage(image);
      if (errorUpload || !url) {
        setLoading(false);
        return errorToast(
          "Não foi possível fazer upload de imagem, entre em contato."
        );
      }
      aptManagerData.image = url;
    }

    await setFirestoreDoc<Omit<AptManagerEntity, "id">>({
      docPath: `users/${aptManagerId}`,
      data: {
        ...aptManagerData
      }
    });

    await updateFirestoreDoc<CondoEntity>({
      documentPath: `/condominium/${condoId}`,
      data: { aptManagersIds: [...(condo?.aptManagersIds || []), aptManagerId] }
    });

    queryClient.invalidateQueries(getAdministratorByCondoIdQueryKey(condoId));
    // console.log(getAdministratorByCondoIdQueryKey(condoId));
    // console.log(aptManagerId);
    successToast("Novo administrador adicionado.");
    setLoading(false);
    reset();
  };

  const handleDelete = async () => {
    if (!adminData) return;
    setLoading(true);
    if (adminData.image) await deleteImage(adminData.image);
    await deleteFirestoreDoc({ documentPath: `/users/${adminData.id}` });
    await deleteUserAuth(adminData.email);

    queryClient.invalidateQueries([condoId]);
    successToast("Funcionário removido com sucesso.");
    setLoading(false);
    onOpenChange(false);
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
          onClick={() => handleSubmit(handleForm)()}
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
      {" "}
      {adminData && (
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
