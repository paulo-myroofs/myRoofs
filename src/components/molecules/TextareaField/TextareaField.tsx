import { FieldValues, Path } from "react-hook-form";
import { twMerge } from "tailwind-merge";

import FormErrorLabel from "@/components/atoms/FormError/formError";
import Label from "@/components/atoms/Label/label";

import { TextareaProps } from "./types";

const TextareaField = <T extends FieldValues>({
  name,
  placeholder,
  className,
  formRegister,
  formErrors,
  label,
  classNameDiv,
  disabled = false,
  value,
  onChange
}: TextareaProps<T>) => {
  return (
    <div className={twMerge("gap flex flex-col gap-1", classNameDiv)}>
      {label && <Label>{label}</Label>}
      <textarea
        disabled={disabled}
        className={twMerge(
          `w-full items-center gap-1 rounded-sm border border-gray-300 px-2 py-2 text-sm outline-none focus:border-black sm:px-4 sm:text-base`,
          className
        )}
        placeholder={placeholder}
        id={name}
        {...(formRegister
          ? formRegister(name as Path<T>, { required: true })
          : {})}
        rows={4}
        value={value}
        onChange={onChange}
      />
      {formErrors && formErrors[name] && formErrors[name]?.message && (
        <FormErrorLabel>{formErrors[name]?.message as string}</FormErrorLabel>
      )}
    </div>
  );
};

export default TextareaField;
