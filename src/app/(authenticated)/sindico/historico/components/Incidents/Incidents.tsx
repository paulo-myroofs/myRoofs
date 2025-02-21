/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";

import { useReactTable, getCoreRowModel } from "@tanstack/react-table";
import Image from "next/image";
import { twMerge } from "tailwind-merge";

import { OccurrenceEntity } from "@/common/entities/occurrences";
import Button from "@/components/atoms/Button/button";
import { DataPaginatedTable } from "@/components/atoms/DataTablePaginated/DataTablePaginated";
import Input from "@/components/atoms/Input/input";
import useOccurrencesByCondoId from "@/hooks/queries/condos/occurrences/useOccurrencesByCondoId";
import useCondo from "@/hooks/queries/condos/useCondo";
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

  const { data: condo } = useCondo(condoId as string);

  const tableInstance = useReactTable({
    data: filteredData ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    initialState: {
      pagination: {
        pageSize: Infinity
      }
    }
  });

  if (!condoId) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <section className="space-y-4">
      <style>
        {`
          @media print {
            body * {
              visibility: hidden;
            }
            .printable-area, .printable-area * {
              visibility: visible;
            }
            .printable-area {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
            }
          }
        `}
      </style>
      <div className={twMerge(boxStyle, "printable-area")}>
        <div className="flex items-center justify-between gap-y-2 px-8 py-4 sm:flex-row">
          <h1 className="text-[18px] font-bold sm:text-[24px]">
            <span className="hidden sm:inline">
              Histórico de ocorrências - {condo?.name}
            </span>
            <span className="inline sm:hidden">Ocorrências</span>
          </h1>

          <div className="ml-2 flex w-auto items-center gap-x-2 md:w-[410px] lg:w-[410px]">
            <Button
              className="text-2xs w-auto min-w-0 items-center gap-x-2 p-2 sm:w-36 sm:p-3"
              onClick={handlePrint}
            >
              <Image
                src="/icons/historic/download_button.svg"
                width={15}
                height={15}
                alt="download Icon"
              ></Image>
              <span className="hidden sm:flex">Imprimir</span>
            </Button>
            <Input
              className={
                "w-full border border-[#DEE2E6] bg-[#F8F9FA] focus:border-[#DEE2E6] sm:max-w-[400px]"
              }
              placeholder="Pesquise uma ocorrência pelo título"
              value={filterValue}
              onChange={(e) => setFilterValue(e.target.value)}
            />
          </div>
        </div>
        <span className="block h-[0.5px] w-full bg-black" />
        <div className="mx-auto flex w-11/12 max-w-[1200px] items-center justify-center pb-8 sm:py-8">
          <DataPaginatedTable<OccurrenceColumnData>
            data={filteredData ?? []}
            columns={columns}
            optionalTable={tableInstance}
          />
        </div>
      </div>
    </section>
  );
};

export default IncidentsTable;
