"use client";

import BorderWrapper from "@/components/atoms/BorderWrapper/BorderWrapper";
import useResidentsNotices from "@/hooks/queries/condos/notices/useResidentsNotices";
import { storageGet } from "@/store/services/storage";

import ResidentsWarningCard from "./components/ResidentsWarningCard/ResidentsWarningCard";

const ResidentsWarnings = () => {
  const condoId = storageGet<string>("condoId") as string;
  const { data: residentsNotices } = useResidentsNotices(condoId);
  if (!residentsNotices || residentsNotices.length === 0) return;

  return (
    <>
      <BorderWrapper className="flex flex-col items-center gap-y-8 p-4 sm:p-8">
        <h1 className=" text-[20px] font-semibold sm:text-[24px]">
          Avisos dos moradores
        </h1>

        <div className="w-full space-y-4 sm:w-[80%]">
          {residentsNotices.map((item) => (
            <ResidentsWarningCard key={item.id} notice={item} />
          ))}
        </div>
      </BorderWrapper>
    </>
  );
};

export default ResidentsWarnings;
