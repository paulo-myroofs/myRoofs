import React from "react";

import commonAreaIcons from "@common/constants/condoCommonAreaIcons";

import { IconsSelectorProps } from "./types";

const IconsSelector = ({ activeIcon, setActiveIcon }: IconsSelectorProps) => {
  return (
    <div className="grid grid-cols-4 gap-1 sm:grid-cols-6 md:grid-cols-7 lg:grid-cols-8 xl:grid-cols-9">
      {commonAreaIcons.map((data) => (
        <div className="flex flex-col items-center gap-1" key={data.type}>
          <button
            type="button"
            className={`border-verde-escuro flex h-[54px] w-[54px] items-center justify-center overflow-hidden rounded-full border transition-all ${activeIcon === data.type && "scale-110"} ${activeIcon && activeIcon !== data.type && "opacity-50"} `}
            onClick={() => setActiveIcon(data.type)}
          >
            {data.icon()}
          </button>
          <p
            className={`mb-2 text-center text-xs ${activeIcon === data.type && "mt-2 mb-0 scale-110"} ${activeIcon && activeIcon !== data.type && "opacity-50"} transition-all`}
          >
            {data.name}
          </p>
        </div>
      ))}
    </div>
  );
};

export default IconsSelector;
