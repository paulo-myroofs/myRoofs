"use client";

import { FieldValues } from "react-hook-form";
import ReactInputMask from "react-input-mask";

import { cn } from "@/lib/utils";

import { InputMaskProps } from "./types";

const InputMask = <T extends FieldValues>({
  mask,
  register,
  name,
  className,
  ...props
}: InputMaskProps<T>) => {
  return (
    <ReactInputMask
      mask={mask}
      maskPlaceholder={null}
      {...props}
      {...register(name)}
      className={cn(
        "ring-offset-primary-50 focus-within:border-primary-300 focus-within:ring-primary-50 h-11 items-center gap-1 rounded-sm border border-gray-300 px-2 text-[14px] outline-none focus-within:border-black sm:px-4 sm:text-base",
        className
      )}
    >
      {(inputProps) => <input {...inputProps} />}
    </ReactInputMask>
  );
};

export default InputMask;
