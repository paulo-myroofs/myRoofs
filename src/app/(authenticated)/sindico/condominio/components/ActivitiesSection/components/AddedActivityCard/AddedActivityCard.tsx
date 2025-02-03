import React from "react";

import Image from "next/image";

import { CondoActivityEntity } from "@/common/entities/common/condo/condoActivity";

interface AddedActivityCardProps {
  activity: CondoActivityEntity;
  readOnly?: boolean;
  onEdit: () => void;
  onRemove: () => void;
}

const AddedActivityCard = ({
  activity,
  onEdit,
  readOnly,
  onRemove
}: AddedActivityCardProps) => {
  return (
    <div className="relative flex w-full items-center gap-4 rounded-md border border-[#202425] p-4 sm:gap-8 sm:p-6">
      <div className="relative flex h-[60px] w-[60px] items-center justify-center overflow-hidden rounded-full border border-[#202425] sm:h-[80px] sm:w-[80px]">
        {activity.image ? (
          <Image src={activity.image} fill alt="Icon da atividade" />
        ) : (
          <Image
            src={"/icons/activity.svg"}
            width={40}
            height={40}
            alt="Icon da atividade"
          />
        )}
      </div>
      <div className="space-y-1 text-[14px] sm:text-[20px]">
        <p className="font-semibold">{activity.name}</p>
        <p> {activity.local}</p>
        <p> {activity.daysHours}</p>
        <p> {activity.professionalName}</p>
      </div>

      {!readOnly && (
        <div className="absolute top-3 right-5 z-20 flex gap-2">
          <button
            type="button"
            onClick={onEdit}
            className="transition-all hover:scale-110"
          >
            <Image
              src={"/icons/commonArea/edit.svg"}
              width={25}
              height={25}
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
              width={25}
              height={25}
              alt="Icon de remoção"
            />
          </button>
        </div>
      )}
    </div>
  );
};

export default AddedActivityCard;
