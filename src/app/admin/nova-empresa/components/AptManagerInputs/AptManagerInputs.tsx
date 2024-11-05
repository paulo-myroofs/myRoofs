import { Path } from "react-hook-form";
import { z } from "zod";

import { inputClassName } from "@/app/contants";
import { maritalStatusOptions } from "@/common/constants/maritalStatusOptions";
import InputField from "@/components/molecules/InputField/inputField";
import SelectField from "@/components/molecules/SelectField/selectField";
import unmask from "@/utils/unmask";
import AddAptManagerSchema from "@/validations/admin/AddAptManager";

import { AptManagerInputsProps } from "./types";

import AddressInputs from "../AddressInputs";

type AddAptManagerForm = z.infer<typeof AddAptManagerSchema>;

const AptManagerInputs = <T extends AddAptManagerForm>({
  watch,
  register,
  errors,
  control,
  setValue,
  hideEmail = false
}: AptManagerInputsProps<T>) => {
  return (
    <>
      <InputField
        name={"ownerBasicInfo.name" as Path<T>}
        className={inputClassName}
        label="Nome"
        register={register}
        formErrors={errors}
        placeholder="Digite o nome"
      />
      {!hideEmail && (
        <InputField
          name={"ownerEmail" as Path<T>}
          // className={inputClassName + ` ${hideEmail && "hidden"}`}
          label="Email"
          register={register}
          formErrors={errors}
          placeholder="Digite o email"
        />
      )}
      <InputField
        name={"ownerBasicInfo.cpf" as Path<T>}
        className={inputClassName}
        label="CPF"
        mask={"999.999.999-99"}
        register={register}
        formErrors={errors}
        placeholder="Digite o CPF"
      />
      <InputField
        name={"ownerBasicInfo.emitter" as Path<T>}
        className={inputClassName}
        label="Emissor"
        register={register}
        formErrors={errors}
        placeholder="Digite o emissor"
      />
      <InputField
        name={"ownerBasicInfo.rg" as Path<T>}
        className={inputClassName}
        label="RG"
        register={register}
        formErrors={errors}
        placeholder="Digite o RG"
      />
      <InputField
        name={"ownerBasicInfo.profession" as Path<T>}
        className={inputClassName}
        label="Profissão"
        register={register}
        formErrors={errors}
        placeholder="Digite a profissão"
      />
      <SelectField
        name={"ownerBasicInfo.maritalStatus" as Path<T>}
        className={inputClassName}
        label="Estado Civil"
        control={control}
        formErrors={errors}
        options={maritalStatusOptions}
      />
      <AddressInputs<T>
        control={control}
        inputClassName={inputClassName}
        register={register}
        formErrors={errors}
        zodObj="ownerAddress"
        setValue={setValue}
        watchCep={unmask(watch()?.ownerAddressData?.cep ?? "")}
      />
    </>
  );
};

export default AptManagerInputs;
