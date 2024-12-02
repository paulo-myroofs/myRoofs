/* eslint-disable @typescript-eslint/no-explicit-any */
import { FieldValues } from "react-hook-form";

import FormErrorLabel from "@/components/atoms/FormError/formError";
import Input from "@/components/atoms/Input/input";
import Label from "@/components/atoms/Label/label";

import { InputFieldProps } from "./types";

const InputFieldForDelete = <T extends FieldValues>({
  register,
  name,
  className,
  formErrors,
  label,
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

  return (
    <div className="flex w-full flex-col gap-1">
      <Label className="text-[#475467]">
        {
          <>
            Por favor escreva{" "}
            <strong className="text-[#000000]">{label}</strong> para confirmar
          </>
        }
      </Label>
      <Input {...props} className={className} name={name} register={register} />

      {errorMessage && (
        <FormErrorLabel>{errorMessage.toString()}</FormErrorLabel>
      )}
    </div>
  );
};

export default InputFieldForDelete;
