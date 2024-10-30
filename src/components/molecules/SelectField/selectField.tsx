import {
  Controller,
  Control,
  FieldErrors,
  FieldValues,
  Path
} from "react-hook-form";

import FormErrorLabel from "@/components/atoms/FormError/formError";
import Label from "@/components/atoms/Label/label";
import Select from "@/components/atoms/Select/select";
import { cn } from "@/lib/utils";

import { SelectFieldProps } from "./types";

const SelectField = <T extends FieldValues>({
  label,
  control,
  name,
  className,
  formErrors,
  options,
  placeholder,
  emptyPlaceholder
}: SelectFieldProps<T>) => {
  let errorMessage: string | undefined;

  // Tratamento de erros sem acessar diretamente o tipo FieldErrors<T>
  if (formErrors && typeof (formErrors as FieldErrors<T>)[name] === "object") {
    const error = (formErrors as FieldErrors<T>)[name];
    errorMessage = error?.message as string | undefined;
  } else if (formErrors) {
    errorMessage = (formErrors as FieldErrors)[name]?.message as
      | string
      | undefined;
  }

  return (
    <div className={cn("flex flex-col gap-1")}>
      {label && <Label>{label}</Label>}
      <Controller
        name={name as Path<T>}
        control={control as Control<T>}
        render={({ field }) => (
          <Select
            onChange={(selectedValue) => field.onChange(selectedValue)}
            options={options}
            value={field.value || ""}
            className={cn("truncate", className)} // Adicionando truncate aqui
            placeholder={placeholder}
            emptyPlaceholder={emptyPlaceholder}
          />
        )}
      />
      {errorMessage && <FormErrorLabel>{errorMessage}</FormErrorLabel>}
    </div>
  );
};

export default SelectField;
