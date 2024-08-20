import React from "react";

import { twMerge } from "tailwind-merge";

import { TitleAtomProps } from "./types";

const TitleAtom = ({ className, children }: TitleAtomProps) => {
  return (
    <h1
      className={twMerge(
        "text-[28px] font-medium text-black sm:text-[32px]",
        className
      )}
    >
      {children}
    </h1>
  );
};

export default TitleAtom;
