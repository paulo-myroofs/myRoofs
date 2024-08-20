import React from "react";

import Image from "next/image";

import condoCommonAreaIcons from "@/common/constants/condoCommonAreaIcons";
import { CondoCommonArea } from "@/common/entities/common/condo/condoCommonAreas";

interface AddedInputCardProps {
  commonArea: CondoCommonArea;
  readOnly?: boolean;
  onEdit: () => void;
  onRemove: () => void;
}

const AddedInputCard = ({
  commonArea,
  onEdit,
  readOnly,
  onRemove
}: AddedInputCardProps) => {
  const iconImageSvg = condoCommonAreaIcons
    .find((i) => i.type === commonArea.type)
    ?.icon("black");

  return (
    <div className="relative flex w-full items-center gap-8 rounded-md border border-[#202425] p-4 sm:p-6">
      <div className="flex h-[60px] w-[60px] items-center justify-center rounded-full border border-[#202425] sm:h-[80px] sm:w-[80px]">
        {iconImageSvg}
      </div>
      <div className="space-y-1 sm:text-[20px] ">
        <p className="font-semibold">{commonArea.name}</p>
        <p className="text-[14px] sm:text-base">
          Capacidade:{" "}
          {commonArea.capacity === 1
            ? "1 pessoa"
            : `${commonArea.capacity} pessoas`}
        </p>
      </div>

      {!readOnly && (
        <div className="absolute right-5 top-3 z-20 flex gap-2">
          <button
            type="button"
            onClick={onEdit}
            className="transition-all hover:scale-110"
          >
            <Image
              src={"/icons/commonArea/edit.svg"}
              width={30}
              height={30}
              alt="Icon de edição"
            />
          </button>
          <button
            type="button"
            onClick={onRemove}
            className="transition-all hover:scale-110"
          >
            <Image
              src={"/icons/commonArea/trash.svg"}
              width={30}
              height={30}
              alt="Icon de remoção"
            />
          </button>
        </div>
      )}
    </div>
  );
};

export default AddedInputCard;
