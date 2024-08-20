import { twMerge } from "tailwind-merge";

import { LabelProps } from "./types";

const Label = ({ children, name, className }: LabelProps) => {
  return (
    <label
      className={twMerge(
        "text-[14px] font-medium text-gray-700 sm:text-base",
        className
      )}
      htmlFor={name}
    >
      {children}
    </label>
  );
};

export default Label;
