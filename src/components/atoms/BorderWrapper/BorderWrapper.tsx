import React, { ReactNode } from "react";

import { twMerge } from "tailwind-merge";

interface BorderWrapperProps {
  children: ReactNode;
  className?: string;
}

const BorderWrapper = ({ children, className }: BorderWrapperProps) => {
  return (
    <div
      className={twMerge(
        "w-full rounded-lg border border-[#818181] p-8",
        className
      )}
    >
      {children}
    </div>
  );
};

export default BorderWrapper;
