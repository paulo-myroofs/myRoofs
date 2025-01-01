"use client";
import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { isCPF } from "brazilian-values";
import { useForm } from "react-hook-form";
import { v4 as uuidV4 } from "uuid";
import { z } from "zod";

import AptManagerInputs from "@/app/admin/nova-empresa/components/AptManagerInputs/AptManagerInputs";
import { brazilStates } from "@/common/constants/brazilStates";
import { maritalStatusOptions } from "@/common/constants/maritalStatusOptions";
import { AptManagerEntity, Status } from "@/common/entities/aptManager";
import { BrazilStatesOptionsType } from "@/common/entities/common/brazilStatesOptionsType";
import { CondoEntity } from "@/common/entities/common/condo/condo";
import { MaritalStatusOptionsType } from "@/common/entities/common/maritalStatusOptionsType";
import Button from "@/components/atoms/Button/button";
import TitleAtom from "@/components/atoms/TitleAtom/TitleAtom";
import useCondo from "@/hooks/queries/condos/useCondo";
import useProfile from "@/hooks/queries/useProfile";
import { errorToast, successToast } from "@/hooks/useAppToast";
import useAuth from "@/hooks/useAuth";
import { setFirestoreDoc, updateFirestoreDoc } from "@/store/services";
import { createUserAuth } from "@/store/services/auth";
import { sendEmail } from "@/store/services/email";
import { storageGet } from "@/store/services/storage";
import unmask from "@/utils/unmask";
import AddAptManagerSchema from "@/validations/admin/AddAptManager";

type AddAptManagerForm = z.infer<typeof AddAptManagerSchema>;

const NovoSindico = () => {
  const condoId = storageGet<string>("condoId") as string;
  // const condoId = "12345";
  const { userUid } = useAuth();
  const { data: condo } = useCondo(condoId);
  const { data: user } = useProfile<AptManagerEntity>(userUid);

  const {
    handleSubmit,
    register,
    control,
    watch,
    formState: { errors },
    reset,
    setValue
  } = useForm<AddAptManagerForm>({
    mode: "all",
    criteriaMode: "all",
    resolver: zodResolver(AddAptManagerSchema),
    defaultValues: {}
  });
  const [loading, setLoading] = useState(false);

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
      companyId: user?.companyId as string,
      role: "aptManager" as const,
      name: data.ownerBasicInfo.name,
      email: data.ownerEmail,
      cpf: unmask(data.ownerBasicInfo.cpf),
      rg: unmask(data.ownerBasicInfo.rg),
      emitter: data.ownerBasicInfo.emitter,
      profession: data.ownerBasicInfo.profession,
      adminRole: data.ownerBasicInfo.adminRole,
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
      image: "",
      status: Status.INACTIVE
    };

    await setFirestoreDoc<AptManagerEntity>({
      docPath: `users/${aptManagerId}`,
      data: aptManagerData
    });

    await updateFirestoreDoc<CondoEntity>({
      documentPath: `/condominium/${condoId}`,
      data: {
        aptManagersIds: [...condo?.aptManagersIds, aptManagerId]
      }
    });

    successToast("Novo síndico adicionado");
    setLoading(false);
    reset();
  };

  if (!user) return;

  return (
    <form
      className="mx-auto mb-40 block w-11/12 max-w-[885px] space-y-8"
      onSubmit={handleSubmit(handleForm)}
    >
      <div className="space-y-4">
        <TitleAtom className="text-center"> Novo síndico </TitleAtom>
        <AptManagerInputs<AddAptManagerForm>
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

export default NovoSindico;
