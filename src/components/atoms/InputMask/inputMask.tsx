"use client";

import { FieldValues } from "react-hook-form";
import ReactInputMask from "react-input-mask";

import { cn } from "@/lib/utils";

import { InputMaskProps } from "./types";
import { JSX, ClassAttributes, InputHTMLAttributes } from "react";

const InputMask = <T extends FieldValues>({
  mask,
  register,
  name,
  className,
  ...props
}: InputMaskProps<T>) => {
  return (
    <ReactInputMask
      className={cn(
        "ring-offset-primary-50 focus-within:border-primary-300 focus-within:ring-primary-50 h-11 items-center gap-1 rounded-sm border border-gray-300 px-2 text-[14px] outline-none focus-within:border-black sm:px-4 sm:text-base",
        className
      )}
      {...props}
      {...(register && register(name))}
      mask={mask}
      maskPlaceholder={null}
      children={undefined}
    />
  );
};

export default InputMask;
