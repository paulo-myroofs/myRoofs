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
  let error: FieldErrors<T> | undefined = formErrors as FieldErrors<T>;

  const fieldPath = name.split(".");

  for (const field of fieldPath) {
    if (error && typeof error === "object" && error[field]) {
      error = error[field] as FieldErrors<T>;
    } else {
      error = undefined;
      break;
    }
  }

  const errorMessage =
    error && typeof error === "object" && "message" in error
      ? String(error.message)
      : undefined;

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
            className={cn("truncate", className)}
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
