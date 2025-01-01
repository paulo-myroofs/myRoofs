"use client";

import { useState, useRef } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Timestamp } from "firebase/firestore";
import { Camera } from "lucide-react";
import Image from "next/image";
import { SubmitHandler, useForm } from "react-hook-form";
import { v4 } from "uuid";
import z from "zod";

import AddressInputsModal from "@/app/admin/nova-empresa/components/AddressInputsModal";
import { brazilStates } from "@/common/constants/brazilStates";
import { BrazilStatesOptionsType } from "@/common/entities/common/brazilStatesOptionsType";
import { EmployeeEntity } from "@/common/entities/employee";
import Button from "@/components/atoms/Button/button";
import TransitionModal from "@/components/atoms/TransitionModal/tempModal";
import InputField from "@/components/molecules/InputField/inputField";
import { getEmployeesByCondoIdQueryKey } from "@/hooks/queries/employee/useEmployeesByCondoId";
import { errorToast, successToast } from "@/hooks/useAppToast";
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
import formatToPhoneMask from "@/utils/formatToPhoneMask";
import unmask from "@/utils/unmask";
import AddEmployeeSchema from "@/validations/aptManager/AddEmployee";

import { EmployeeModalProps } from "./types";

type AddEmployeeForm = z.infer<typeof AddEmployeeSchema>;
const inputClassName = "baorder-[#DEE2E6] bg-[#F8F9FA]";

export default function CreateEmployeeModal({
  isOpen,
  onOpenChange,
  employeeData
}: EmployeeModalProps) {
  const condoId = storageGet<string>("condoId");
  const [image, setImage] = useState<File | string | null>(
    employeeData?.image ?? null
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
  } = useForm<AddEmployeeForm>({
    resolver: zodResolver(AddEmployeeSchema),
    values: {
      name: employeeData?.name ?? "",
      email: employeeData?.email ?? "",
      occupation: employeeData?.occupation ?? "",
      cpf: employeeData?.cpf ?? "",
      address: {
        cep: employeeData?.address.cep ?? "",
        state:
          brazilStates.find(
            (item) => item.label === employeeData?.address?.state
          )?.value ?? "",
        city: employeeData?.address?.city ?? "",
        neighborhood: employeeData?.address?.neighborhood ?? "",
        address: employeeData?.address?.address ?? "",
        number: employeeData?.address?.number ?? ""
      },
      phone: employeeData?.phone ? formatToPhoneMask(employeeData?.phone) : ""
    }
  });
  const inputUpload = useRef<HTMLInputElement | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const currentFile = e.target.files?.[0];
    if (currentFile) {
      setImage(currentFile);
    }
  };

  const handleForm: SubmitHandler<AddEmployeeForm> = async (data) => {
    if (!condoId) {
      return errorToast("Erro ao buscar o condomínio.");
    }

    setLoading(true);

    let imageUrl = employeeData?.image ?? null;
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
      imageUrl = url;

      if (employeeData && employeeData.image) {
        await deleteImage(employeeData.image);
      }
    }

    const finalData: Partial<EmployeeEntity> = {
      name: data.name,
      cpf: unmask(data.cpf),
      phone: unmask(data.phone),
      email: data.email,
      address: {
        cep: unmask(data.address.cep),
        state: brazilStates.find((item) => item.value === data.address.state)
          ?.label as BrazilStatesOptionsType,
        city: data.address.city,
        neighborhood: data.address.neighborhood,
        address: data.address.address,
        number: data.address.number
      },
      occupation: data.occupation,
      image: imageUrl,
      condominiumCode: condoId,
      role: "employee"
    };

    if (!employeeData) {
      const password = v4().slice(0, 8);

      const { error: errorEmail } = await sendEmail(data.email, password);

      if (errorEmail) {
        setLoading(false);
        return errorToast(
          "Não foi possível enviar email com credenciais, entre em contato."
        );
      }

      const { error, uid: employeeId } = await createUserAuth(
        data.email,
        password
      );

      if (error || !employeeId) {
        setLoading(false);
        return errorToast(error ?? "Algo deu errado.");
      }

      await setFirestoreDoc<Omit<EmployeeEntity, "id">>({
        docPath: `/users/${employeeId}`,
        data: {
          ...finalData,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now()
        } as EmployeeEntity
      });

      successToast("Funcionário cadastrado com sucesso.");
    } else {
      await updateFirestoreDoc<Omit<EmployeeEntity, "id">>({
        documentPath: `users/${employeeData.id}`,
        data: {
          ...finalData,
          updatedAt: Timestamp.now()
        } as EmployeeEntity
      });
      setImage(imageUrl);
      successToast("Funcionário atualizado com sucesso.");
    }
    setLoading(false);
    queryClient.invalidateQueries(getEmployeesByCondoIdQueryKey(condoId));
    setImage(null);
    reset();
    onOpenChange(false);
  };

  const handleDelete = async () => {
    if (!employeeData) return;
    setLoading(true);
    await deleteFirestoreDoc({
      documentPath: `/users/${employeeData.id}`
    });
    await deleteUserAuth(employeeData.id);
    setLoading(false);
    successToast("Funcionário removido com sucesso.");
    queryClient.invalidateQueries(["employees", condoId]);
    onOpenChange(false);
  };

  return (
    <TransitionModal
      isOpen={isOpen}
      title={
        employeeData ? "Informações do Funcionário" : "Cadastro de Funcionários"
      }
      description={
        employeeData
          ? "Editar Informações Cadastradas"
          : "Insira as informações necessárias para registar o funcionário"
      }
      onOpenChange={onOpenChange}
      confirmBtn={
        <Button
          variant="icon"
          size="lg"
          className=" w-[210px] bg-[#202425]"
          loading={loading}
          onClick={handleSubmit(handleForm)}
        >
          {employeeData ? "Salvar Alterações" : "Registrar"}
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
      {employeeData && (
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
          {image || employeeData?.image ? (
            <Image
              className="object-cover"
              fill
              src={
                typeof image === "string"
                  ? image
                  : image instanceof File
                    ? URL.createObjectURL(image)
                    : employeeData?.image || ""
              }
              alt="Imagem do funcionário"
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
        <div className="Nome w-full">
          <InputField
            formErrors={errors}
            name="name"
            className={inputClassName}
            label="Nome Completo"
            register={register}
            placeholder="Digite aqui"
          />
        </div>
        <div className="flex gap-3 max-sm:flex-wrap">
          <InputField
            name="occupation"
            className={"w-full border-[#DEE2E6] bg-[#F8F9FA]"}
            label="Cargo"
            register={register}
            formErrors={errors}
            placeholder="Digite aqui"
          />
          <InputField
            name="cpf"
            className={"w-full border-[#DEE2E6] bg-[#F8F9FA]"}
            label="CPF"
            mask={"999.999.999-99"}
            register={register}
            formErrors={errors}
            placeholder="000.000.000-00"
          />
        </div>
        <div className="flex w-full gap-3 max-sm:flex-wrap">
          <InputField
            name="email"
            disabled={!!employeeData}
            className={
              "w-full border-[#DEE2E6] bg-[#F8F9FA] disabled:opacity-50"
            }
            label="Email"
            register={register}
            formErrors={errors}
            placeholder="Digite aqui"
          />
          <InputField
            mask="(99) 99999-9999"
            className={"w-full border-[#DEE2E6] bg-[#F8F9FA]"}
            name="phone"
            register={register}
            formErrors={errors}
            label="Telefone"
            placeholder="Digite aqui"
          />
        </div>
        <div className="w-full">
          <AddressInputsModal
            control={control}
            inputClassName={inputClassName}
            register={register}
            formErrors={errors}
            zodObj="address"
            setValue={setValue}
            watchCep={unmask(watch("address.cep") ?? "")}
          />
        </div>
      </form>
    </TransitionModal>
  );
}
