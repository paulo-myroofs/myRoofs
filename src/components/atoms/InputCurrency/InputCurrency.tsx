import { Controller, FieldValues } from "react-hook-form";
import { NumericFormat } from "react-number-format";

import { cn } from "@/lib/utils";

import { InputCurrencyProps } from "./types";

const InputCurrency = <T extends FieldValues>({
  name,
  className,
  control,
  ...props
}: InputCurrencyProps<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { ref, ...rest } }) => (
        <NumericFormat
          thousandSeparator="."
          decimalSeparator=","
          prefix="R$ "
          decimalScale={2}
          getInputRef={ref}
          className={cn(
            "h-11 w-full items-center gap-1 rounded-sm border border-gray-300 px-2 text-sm outline-none focus:border-black sm:px-4 sm:text-base",
            className
          )}
          {...rest}
          {...props}
          type="tel"
          value={rest.value}
          defaultValue={rest.value}
        />
      )}
    />
  );
};

export default InputCurrency;
