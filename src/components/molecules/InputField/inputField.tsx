/* eslint-disable @typescript-eslint/no-explicit-any */
import { FieldValues } from "react-hook-form";

import FormErrorLabel from "@/components/atoms/FormError/formError";
import Input from "@/components/atoms/Input/input";
import InputCurrency from "@/components/atoms/InputCurrency/InputCurrency";
import InputMask from "@/components/atoms/InputMask/inputMask";
import Label from "@/components/atoms/Label/label";

import { InputFieldProps } from "./types";

const InputField = <T extends FieldValues>({
  register,
  name,
  className,
  labelClassName,
  mask,
  formErrors,
  label,
  currency = false,
  control,
  ...props
}: InputFieldProps<T>) => {
  let errorMessage = null;

  if (formErrors) {
    if (name?.includes(".")) {
      const [firstName, secondName] = name.split(".");

      errorMessage = formErrors[firstName]
        ? (formErrors as any)[firstName][secondName]?.message
        : null;
    } else {
      errorMessage = formErrors[name]?.message;
    }
  }

  if (currency && control && name) {
    return (
      <div className="flex flex-col gap-1">
        {label && <Label>{label}</Label>}
        <InputCurrency
          className={className}
          name={name}
          control={control}
          {...props}
        />

        {errorMessage && (
          <FormErrorLabel>{errorMessage.toString()}</FormErrorLabel>
        )}
      </div>
    );
  }

  if (mask && name && register) {
    return (
      <div className="flex w-full flex-col gap-1">
        {label && <Label className={labelClassName}>{label}</Label>}
        <InputMask
          {...props}
          className={className}
          mask={mask}
          name={name}
          register={register}
        />

        {errorMessage && (
          <FormErrorLabel>{errorMessage.toString()}</FormErrorLabel>
        )}
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-1">
      {label && <Label className={labelClassName}>{label}</Label>}
      <Input {...props} className={className} name={name} register={register} />

      {errorMessage && (
        <FormErrorLabel>{errorMessage.toString()}</FormErrorLabel>
      )}
    </div>
  );
};

export default InputField;
