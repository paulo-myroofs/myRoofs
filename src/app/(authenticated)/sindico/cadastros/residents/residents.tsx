"use client";

import { useState } from "react";

import { twMerge } from "tailwind-merge";

import { ResidentEntity } from "@/common/entities/resident";
import { DataPaginatedTable } from "@/components/atoms/DataTablePaginated/DataTablePaginated";
import Input from "@/components/atoms/Input/input";
import useResidentsByCondoId from "@/hooks/queries/residents/useResidentsByCondoId";
import { storageGet } from "@/store/services/storage";

import { columns } from "./residentsColumns";

const boxStyle = "border border-black rounded-[8px]";

const ResidentsTable = () => {
  const condoId = storageGet<string>("condoId");

  const [filterValue, setFilterValue] = useState("");
  const { data: residents } = useResidentsByCondoId(condoId as string);
  const filteredData = residents?.filter((item) =>
    item.name.toLocaleLowerCase().includes(filterValue.toLocaleLowerCase())
  );

  if (!condoId) return;

  return (
    <section className="space-y-4">
      <div className={twMerge(boxStyle)}>
        <div className="flex flex-col items-center justify-between gap-y-3 px-8 py-4 md:flex-row">
          <h1 className="text-[18px] font-bold sm:text-[24px]">Moradores</h1>

          <Input
            className={
              "max-w-[300px] border border-[#DEE2E6] bg-[#F8F9FA] focus:border-[#DEE2E6]"
            }
            placeholder="Pesquise pelo nome"
            value={filterValue}
            onChange={(e) => setFilterValue(e.target.value)}
          />
        </div>
        <span className="block h-[0.5px] w-full bg-black" />
        <div className="mx-auto flex w-11/12 max-w-[1200px] items-center justify-center pb-8 sm:py-8">
          <DataPaginatedTable<ResidentEntity>
            data={filteredData ?? []}
            columns={columns}
          />
        </div>
      </div>
    </section>
  );
};

export default ResidentsTable;
