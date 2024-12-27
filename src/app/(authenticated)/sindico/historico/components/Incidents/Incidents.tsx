/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";

import { twMerge } from "tailwind-merge";

import { OccurrenceEntity } from "@/common/entities/occurrences";
import { DataPaginatedTable } from "@/components/atoms/DataTablePaginated/DataTablePaginated";
import Input from "@/components/atoms/Input/input";
import useOccurrencesByCondoId from "@/hooks/queries/condos/occurrences/useOccurrencesByCondoId";
import { storageGet } from "@/store/services/storage";

import { columns } from "./columns";

const boxStyle = "border border-black rounded-[8px]";

const IncidentsTable = () => {
  const condoId = storageGet<string>("condoId");
  const [filterValue, setFilterValue] = useState("");
  const { data: occurrences } = useOccurrencesByCondoId(condoId as string);
  const filteredData = occurrences?.filter((item) =>
    item.title.toLocaleLowerCase().includes(filterValue.toLocaleLowerCase())
  );

  if (!condoId) return;

  return (
    <section className="space-y-4">
      <div className={twMerge(boxStyle)}>
        <div className="flex flex-col items-center justify-between gap-y-2 px-8 py-4 sm:flex-row">
          <h1 className="text-[18px] font-bold sm:text-[24px]">
            <span className="hidden sm:inline">Histórico de ocorrências</span>
            <span className="inline sm:hidden">Ocorrências</span>
          </h1>

          <Input
            className={
              "w-full border border-[#DEE2E6] bg-[#F8F9FA] focus:border-[#DEE2E6] sm:max-w-[400px]"
            }
            placeholder="Pesquise um ocorrência pelo título"
            value={filterValue}
            onChange={(e) => setFilterValue(e.target.value)}
          />
        </div>
        <span className="block h-[0.5px] w-full bg-black" />
        <div className="mx-auto flex w-11/12 max-w-[1200px] items-center justify-center pb-8 sm:py-8">
          <DataPaginatedTable<OccurrenceEntity>
            data={filteredData ?? []}
            columns={columns}
          />
        </div>
      </div>
    </section>
  );
};

export default IncidentsTable;
