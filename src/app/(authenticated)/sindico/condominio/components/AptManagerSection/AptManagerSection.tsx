"use client";

import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { z } from "zod";

import AptManagerInputs from "@/app/admin/nova-empresa/components/AptManagerInputs/AptManagerInputs";
import { brazilStates } from "@/common/constants/brazilStates";
import { maritalStatusOptions } from "@/common/constants/maritalStatusOptions";
import { AptManagerEntity } from "@/common/entities/aptManager";
import { BrazilStatesOptionsType } from "@/common/entities/common/brazilStatesOptionsType";
import { MaritalStatusOptionsType } from "@/common/entities/common/maritalStatusOptionsType";
import Button from "@/components/atoms/Button/button";
import useProfile from "@/hooks/queries/useProfile";
import { errorToast } from "@/hooks/useAppToast";
import { queryClient } from "@/store/providers/queryClient";
import { updateFirestoreDoc } from "@/store/services";
import unmask from "@/utils/unmask";
import AddAptManagerSchema from "@/validations/admin/AddAptManager";

type AddAptManagerForm = z.infer<typeof AddAptManagerSchema>;

const AptManagerSection = ({ aptManagerId }: { aptManagerId: string }) => {
  const [loading, setLoading] = useState(false);
  const [isEditActive, setIsEditActive] = useState(false);
  const { data: aptManager } = useProfile<AptManagerEntity>(aptManagerId);
  const {
    handleSubmit,
    register,
    control,
    watch,
    formState: { errors },
    setValue,
    reset
  } = useForm<AddAptManagerForm>({
    mode: "all",
    criteriaMode: "all",
    resolver: zodResolver(AddAptManagerSchema),
    values: {
      ownerBasicInfo: {
        name: aptManager?.name ?? "",
        cpf: aptManager?.cpf ?? "",
        rg: aptManager?.rg ?? "",
        emitter: aptManager?.emitter ?? "",
        profession: aptManager?.profession ?? "",
        maritalStatus:
          maritalStatusOptions?.find(
            (v) => v.label === aptManager?.maritalStatus
          )?.value ?? "",
        status: aptManager?.status ?? "",
        adminRole: aptManager?.role ?? ""
      },
      ownerAddressData: {
        address: aptManager?.address ?? "",
        neighborhood: aptManager?.neighborhood ?? "",
        state:
          brazilStates.find((item) => item.label === aptManager?.state)
            ?.value ?? "",
        number: aptManager?.number ?? "",
        cep: aptManager?.cep ?? "",
        city: aptManager?.city ?? ""
      },
      ownerEmail: aptManager?.email ?? ""
    }
  });

  const handleForm = async (data: AddAptManagerForm) => {
    setLoading(true);
    const aptManagerData = {
      companyId: aptManager?.companyId,
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
    const { error } = await updateFirestoreDoc<AptManagerEntity>({
      documentPath: "/users/" + aptManagerId,
      data: aptManagerData
    });

    if (error) {
      return errorToast(error);
    }
    queryClient.invalidateQueries(["users"]);
    queryClient.invalidateQueries(["profile"]);
    setLoading(false);
    setIsEditActive(false);
  };

  const handleEdit = () => {
    setIsEditActive((prev) => {
      if (prev) {
        reset();
      }
      return !prev;
    });
  };

  return (
    <form
      className="mx-auto flex w-full max-w-[1300px] flex-col items-end  gap-4"
      onSubmit={handleSubmit(handleForm)}
    >
      <div
        className={` mt-4 w-full space-y-4 ${!isEditActive && "pointer-events-none opacity-70"}`}
      >
        <AptManagerInputs<AddAptManagerForm>
          setValue={setValue}
          errors={errors}
          register={register}
          control={control}
          watch={watch}
          hideEmail
        />
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={handleEdit}
          className="transition-all hover:scale-110"
        >
          {!isEditActive ? (
            <Image
              src={"/icons/commonArea/edit.svg"}
              width={30}
              height={30}
              alt="Icon de edição"
            />
          ) : (
            <X />
          )}
        </button>
        <Button
          variant={"basicBlack"}
          disabled={!isEditActive}
          loading={loading}
          className="disabled:opacity-40"
        >
          Salvar
        </Button>
      </div>
    </form>
  );
};

export default AptManagerSection;
