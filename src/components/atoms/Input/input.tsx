import { FieldValues } from "react-hook-form";

import { cn } from "@/lib/utils";

import { InputProps } from "./types";

const Input = <T extends FieldValues>({
  register,
  name,
  className,
  ...props
}: InputProps<T>) => {
  return (
    <input
      className={cn(
        "h-11 w-full items-center gap-1 rounded-sm border border-gray-300 px-2 text-[14px] outline-none focus:border-black sm:px-4 sm:text-base",
        className
      )}
      autoComplete=""
      {...props}
      {...(register && name ? register(name) : {})}
    />
  );
};

export default Input;
