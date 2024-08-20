"use client";

import { useState, useRef } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Timestamp } from "firebase/firestore";
import { Camera } from "lucide-react";
import Image from "next/image";
import { SubmitHandler, useForm } from "react-hook-form";
import { v4 } from "uuid";
import z from "zod";

import { EmployeeEntity } from "@/common/entities/employee";
import Button from "@/components/atoms/Button/button";
import TransitionModal from "@/components/atoms/TransitionModal/tempModal";
import InputField from "@/components/molecules/InputField/inputField";
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
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<AddEmployeeForm>({
    resolver: zodResolver(AddEmployeeSchema),
    defaultValues: employeeData || {}
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
        // is editting
        await deleteImage(employeeData.image);
      }
    }

    const finalData: Partial<EmployeeEntity> = {
      name: data.name,
      cpf: unmask(data.cpf),
      phone: unmask(data.phone),
      email: data.email,
      address: data.address,
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

      const res = await setFirestoreDoc<Omit<EmployeeEntity, "id">>({
        docPath: `/users/${employeeId}`,
        data: {
          ...finalData,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now()
        } as EmployeeEntity
      });

      console.log(res);
      successToast("Funcionário cadastrado com sucesso.");
    } else {
      await updateFirestoreDoc<Omit<EmployeeEntity, "id">>({
        documentPath: `users/${employeeData.id}`,
        data: {
          ...finalData,
          updatedAt: Timestamp.now()
        } as EmployeeEntity
      });
      successToast("Funcionário atualizado com sucesso.");
    }
    setLoading(false);
    queryClient.invalidateQueries(["employees", condoId]);
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
        employeeData ? "Informações do Fucionário" : "Cadastro de Funcionários"
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
      <div className="flex gap-5 max-sm:flex-col">
        <div className="relative flex h-[64px]  w-[64px] items-center justify-center overflow-hidden rounded-full bg-gray-400 bg-cover">
          {image ? (
            <Image
              className="object-cover"
              fill
              src={
                typeof image === "string" ? image : URL.createObjectURL(image)
              }
              alt="Imagem"
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
        <div className="flex gap-4 max-sm:flex-wrap">
          <InputField
            name="occupation"
            className={"w-full min-w-[215px] border-[#DEE2E6] bg-[#F8F9FA]"}
            label="Cargo"
            register={register}
            formErrors={errors}
            placeholder="Digite aqui"
          />
          <InputField
            name="cpf"
            className={"w-full min-w-[215px] border-[#DEE2E6] bg-[#F8F9FA]"}
            label="CPF"
            mask={"999.999.999-99"}
            register={register}
            formErrors={errors}
            placeholder="000.000.000-00"
          />
        </div>
        <div className="flex w-full gap-4 max-sm:flex-wrap">
          <InputField
            name="email"
            disabled={!!employeeData}
            className={
              "w-full min-w-[215px] border-[#DEE2E6] bg-[#F8F9FA] disabled:opacity-50"
            }
            label="Email"
            register={register}
            formErrors={errors}
            placeholder="Digite aqui"
          />
          <InputField
            mask="(99) 99999-9999"
            className={"w-full min-w-[215px] border-[#DEE2E6] bg-[#F8F9FA]"}
            name="phone"
            register={register}
            formErrors={errors}
            label="Telefone"
            placeholder="Digite aqui"
          />
        </div>
        <div className="w-full">
          <InputField
            name="address"
            className={inputClassName}
            label="Endereço"
            register={register}
            formErrors={errors}
            placeholder="Digite o endereço"
          />
        </div>
      </form>
    </TransitionModal>
  );
}