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
import { OccurrenceColumnData } from "./types";

const boxStyle = "border border-black rounded-[8px]";

const IncidentsTable = () => {
  const condoId = storageGet<string>("condoId");
  const [filterValue, setFilterValue] = useState("");
  const { data: occurrences } = useOccurrencesByCondoId(
    condoId as string,
    (data) =>
      data.map(
        (item: OccurrenceEntity) =>
          ({
            id: item.id,
            userId: item.userId,
            upload: item.upload,
            date: item.date,
            status: item.status,
            details: item.details,
            condoId: condoId as string,
            title: item.title,
            return: item.return,
            reaction: item.reaction
          }) as OccurrenceColumnData
      )
  );
  const filteredData: OccurrenceColumnData[] | undefined = occurrences?.filter(
    (item: OccurrenceColumnData) =>
      item.title.toLocaleLowerCase().includes(filterValue.toLocaleLowerCase())
  );

  if (!condoId) return;

  return (
    <section className="space-y-4">
      <div className={twMerge(boxStyle)}>
        <div className="flex items-center justify-between px-8 py-4">
          <h1 className="text-[18px] font-bold sm:text-[24px]">
            <span className="hidden sm:inline">Histórico de ocorrências</span>
            <span className="inline sm:hidden">Ocorrências</span>
          </h1>

          <Input
            className={
              "max-w-[300px] border border-[#DEE2E6] bg-[#F8F9FA] focus:border-[#DEE2E6]"
            }
            placeholder="Pesquise um ocorrência pelo título"
            value={filterValue}
            onChange={(e) => setFilterValue(e.target.value)}
          />
        </div>
        <span className="block h-[0.5px] w-full bg-black" />
        <div className="mx-auto flex w-11/12 max-w-[1200px] items-center justify-center pb-8 sm:py-8">
          <DataPaginatedTable<OccurrenceColumnData>
            data={filteredData ?? []}
            columns={columns}
          />
        </div>
      </div>
    </section>
  );
};

export default IncidentsTable;
