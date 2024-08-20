import React from "react";

import Label from "@/components/atoms/Label/label";
import commonAreaIcons from "@common/constants/condoCommonAreaIcons";

import { IconsSelectorProps } from "./types";

const IconsSelector = ({ activeIcon, setActiveIcon }: IconsSelectorProps) => {
  return (
    <div className="flex flex-col gap-1">
      <Label>Ícone</Label>
      <div className="flex gap-2">
        {commonAreaIcons.map((data) => (
          <button
            type="button"
            className={`flex h-[50px] w-[50px] items-center justify-center overflow-hidden rounded-full border border-verde-escuro  transition-all ${activeIcon === data.type && "scale-110"} ${activeIcon && activeIcon !== data.type && "opacity-50"} `}
            key={data.type}
            onClick={() => setActiveIcon(data.type)}
          >
            {data.icon()}
          </button>
        ))}
      </div>
    </div>
  );
};

export default IconsSelector;
