"use client";

import Image from "next/image";
import Link from "next/link";

import BorderWrapper from "@/components/atoms/BorderWrapper/BorderWrapper";
import { extractFilename } from "@/utils/extractFilename";
import { timestampToDate } from "@/utils/timestampToDate";

import { WarningCardProps } from "./types";

const WarningCard = ({
  image,
  about,
  text,
  updatedAt,
  fileUrl,
  onEdit,
  onRemove
}: WarningCardProps) => {
  const updatedAtDate = timestampToDate(updatedAt);
  const hours = updatedAtDate.getHours();
  const minutes = updatedAtDate.getMinutes();
  const formattedHours = hours.toString().padStart(2, "0");
  const formattedMinutes = minutes.toString().padStart(2, "0");
  const finalHours = `${formattedHours}:${formattedMinutes}`;

  return (
    <>
      <BorderWrapper
        className={`relative flex flex-col gap-6 rounded-md p-6 md:flex-row `}
      >
        <div className="relative h-[70px] w-[70px] flex-shrink-0 overflow-hidden rounded-full">
          <Image
            src={image}
            fill
            alt="Imagem do aviso"
            className="object-cover"
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-[20px] font-bold">{about}</h3>
              <p className="text-[14px]">
                {" "}
                {updatedAtDate.toLocaleDateString()} - {finalHours}
              </p>
            </div>
            <div className="absolute right-5 top-3 z-20 flex gap-2">
              {onEdit && (
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
              )}
              {onRemove && (
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
              )}
            </div>
          </div>
          <p>{text}</p>

          {fileUrl && (
            <div>
              <span>Link do arquivo: </span>
              <Link
                href={fileUrl}
                target="_blank"
                className="mt-8  text-[#2A27CE] hover:underline"
              >
                {extractFilename(fileUrl)}
              </Link>
            </div>
          )}
        </div>
      </BorderWrapper>
    </>
  );
};

export default WarningCard;
