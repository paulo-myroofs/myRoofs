import React from "react";

import Label from "@/components/atoms/Label/label";
import commonAreaIcons from "@common/constants/condoCommonAreaIcons";

import { IconsSelectorProps } from "./types";

const IconsSelector = ({ activeIcon, setActiveIcon }: IconsSelectorProps) => {
  return (
    <div className="flex flex-col gap-1">
      <Label>Ícone</Label>
      <div className="flex gap-2 align-center flex-wrap">
        {commonAreaIcons.map((data) => (
          <div className="align-center flex flex-col">
            <button
              type="button"
              className={`flex h-[90px] w-[90px] items-center justify-center overflow-hidden rounded-full border border-verde-escuro  transition-all ${activeIcon === data.type && "scale-110"} ${activeIcon && activeIcon !== data.type && "opacity-50"} `}
              key={data.type}
              onClick={() => setActiveIcon(data.type)}
            >
              {data.icon()}
            </button>
            <p
              className={`text-center mb-2 text-xs ${activeIcon === data.type && "scale-110 mt-2 mb-0"} ${activeIcon && activeIcon !== data.type && "opacity-50"} transition-all`}
            >
              {data.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IconsSelector;
