import React, { useEffect, useState } from "react";

import {
  Control,
  FieldErrors,
  FieldValues,
  UseFormRegister,
  UseFormSetValue,
  Path,
  PathValue
} from "react-hook-form";

import { brazilStates } from "@/common/constants/brazilStates";
import InputField from "@/components/molecules/InputField/inputField";
import SelectField from "@/components/molecules/SelectField/selectField";
import useAddressByCep from "@/hooks/useAddressByCep";

export interface AddressInputsProps<T extends FieldValues> {
  inputClassName: string;
  register: UseFormRegister<T>;
  formErrors: FieldErrors<T>;
  control: Control<T>;
  zodObj: "addressData" | "ownerAddressData" | "address";
  watchCep: string;
  setValue: UseFormSetValue<T>;
}

const AddressInputs = <T extends FieldValues>({
  inputClassName,
  register,
  formErrors,
  control,
  zodObj,
  watchCep,
  setValue
}: AddressInputsProps<T>) => {
  const [enableSearch, setEnableSearch] = useState(false);
  const { data, isFetching, refetch } = useAddressByCep(watchCep, enableSearch);

  useEffect(() => {
    if (data) {
      setValue(
        `${zodObj}.neighborhood` as Path<T>,
        data.bairro as PathValue<T, Path<T>>
      );
      setValue(
        `${zodObj}.address` as Path<T>,
        data.logradouro as PathValue<T, Path<T>>
      );
      setValue(
        `${zodObj}.state` as Path<T>,
        brazilStates.find((item) => item.id === data.uf)?.value as PathValue<
          T,
          Path<T>
        >
      );
      setValue(
        `${zodObj}.city` as Path<T>,
        data.localidade as PathValue<T, Path<T>>
      );
    }
  }, [data, setValue, zodObj]);

  return (
    <>
      <div className="grid gap-3 sm:grid-cols-3">
        <InputField
          mask={"99999-999"}
          name={`${zodObj}.cep` as Path<T>}
          className={inputClassName}
          label="CEP"
          register={register}
          formErrors={formErrors}
          placeholder="Digite o CEP"
          onBlurCapture={() => {
            if (enableSearch && !isFetching) {
              refetch();
              return;
            }
            if (!enableSearch) {
              setEnableSearch(true);
            }
          }}
        />
        <SelectField
          label="UF"
          control={control}
          name={`${zodObj}.state` as Path<T>}
          options={brazilStates}
          formErrors={formErrors}
        />
        <InputField
          name={`${zodObj}.city` as Path<T>}
          className={inputClassName}
          label="Cidade"
          register={register}
          formErrors={formErrors}
          placeholder="Digite a cidade"
        />
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="sm:col-span-2">
          <InputField
            name={`${zodObj}.address` as Path<T>}
            className={inputClassName}
            label="Endereço"
            register={register}
            formErrors={formErrors}
            placeholder="Digite o endereço"
          />
        </div>
        <div className="sm:col-span-1">
          <InputField
            name={`${zodObj}.number` as Path<T>}
            className={inputClassName}
            label="Número"
            register={register}
            formErrors={formErrors}
            placeholder="Digite o número"
          />
        </div>
      </div>
      <InputField
        name={`${zodObj}.neighborhood` as Path<T>}
        className={inputClassName}
        label="Bairro"
        register={register}
        formErrors={formErrors}
        placeholder="Digite o nome do bairro"
      />
    </>
  );
};

export default AddressInputs;
