/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";

import { twMerge } from "tailwind-merge";

import { LostFound } from "@/common/entities/lostAndFound";
import { DataPaginatedTable } from "@/components/atoms/DataTablePaginated/DataTablePaginated";
import Input from "@/components/atoms/Input/input";
import useLostFoundByCondoId from "@/hooks/queries/lostFound/useLostFoundByCondoId";
import { storageGet } from "@/store/services/storage";

import { columns } from "./columns";

const boxStyle = "border border-black rounded-[8px]";

const LostAndFoundTable = () => {
  const condoId = storageGet<string>("condoId");
  const [filterValue, setFilterValue] = useState("");
  const { data: lostFoundData } = useLostFoundByCondoId(condoId as string);
  const filteredData = lostFoundData?.filter((item) =>
    item.description
      .toLocaleLowerCase()
      .includes(filterValue.toLocaleLowerCase())
  );
  if (!condoId) return;

  return (
    <section className="space-y-4">
      <div className={twMerge(boxStyle)}>
        <div className="flex items-center justify-between px-8 py-4">
          <h1 className="text-[18px] font-bold sm:text-[24px]">
            Achados e Perdidos
          </h1>

          <Input
            className={
              "max-w-[300px] border border-[#DEE2E6] bg-[#F8F9FA] focus:border-[#DEE2E6]"
            }
            placeholder="Pesquise um perdido ou achado pela descrição"
            value={filterValue}
            onChange={(e) => setFilterValue(e.target.value)}
          />
        </div>
        <span className="block h-[0.5px] w-full bg-black" />
        <div className="mx-auto flex w-11/12 max-w-[1200px] items-center justify-center pb-8 sm:py-8">
          <DataPaginatedTable<LostFound>
            data={filteredData ?? []}
            columns={columns}
          />
        </div>
      </div>
    </section>
  );
};

export default LostAndFoundTable;
