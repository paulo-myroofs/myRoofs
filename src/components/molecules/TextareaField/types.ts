import { TextareaHTMLAttributes } from "react";

import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";

export interface TextareaProps<T extends FieldValues> {
  label?: string;
  placeholder: string;
  name: string;
  formRegister?: UseFormRegister<T>;
  formErrors?: FieldErrors<T>;
  className?: string;
  classNameDiv?: string;
  disabled?: boolean;
  value?: string;
  onChange?: TextareaHTMLAttributes<HTMLTextAreaElement>["onChange"];
}
