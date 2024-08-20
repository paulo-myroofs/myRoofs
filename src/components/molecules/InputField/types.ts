import { ComponentProps } from "react";

import {
  Control,
  FieldErrors,
  FieldValues,
  Path,
  UseFormRegister
} from "react-hook-form";

export interface InputFieldProps<T extends FieldValues>
  extends ComponentProps<"input"> {
  mask?: string;
  name?: Path<T>;
  register?: UseFormRegister<T>;
  formErrors?: FieldErrors<T>;
  control?: Control<T>;
  label?: string;
  currency?: boolean;
  labelClassName?: string;
}
