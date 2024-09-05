/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";

import { twMerge } from "tailwind-merge";

import { DataPaginatedTable } from "@/components/atoms/DataTablePaginated/DataTablePaginated";
import FilterSelect from "@/components/atoms/FilterSelect/filterSelect";
import Input from "@/components/atoms/Input/input";
import useCondoAssemblies from "@/hooks/queries/condos/assemblies/useCondoAssemblies";
import useCondoNotices from "@/hooks/queries/condos/notices/useCondoNotices";
import useResidentsNotices from "@/hooks/queries/condos/notices/useResidentsNotices";
import { storageGet } from "@/store/services/storage";
import shuffleArrays from "@/utils/shuffleArrays";

import { columns } from "./columns";

const boxStyle = "border border-black rounded-[8px]";

const WarningTable = () => {
  const condoId = storageGet<string>("condoId");
  const [filterValue, setFilterValue] = useState("");
  const { data: condoNotices } = useCondoNotices(condoId as string);
  const { data: notices } = useResidentsNotices(condoId as string);
  const { data: condoAssemblies } = useCondoAssemblies(condoId as string);
  const [filterSelectValue, setFilterSelectValue] = useState<
    "condo" | "resident" | ""
  >("");

  const shuffledNoticesCondoNotices = shuffleArrays(
    condoNotices?.map((item) => ({
      ...item,
      type: "condoWarning"
    })) ?? [],
    notices?.map((item) => ({
      ...item,
      type: "residentWarning"
    })) ?? []
  );

  const lastShuffle = shuffleArrays(
    shuffledNoticesCondoNotices,
    condoAssemblies?.map((item) => ({
      ...item,
      type: "condoAssembly"
    })) ?? []
  );

  const filteredData = lastShuffle.filter(
    (item) =>
      item.about
        .toLocaleLowerCase()
        .includes(filterValue.toLocaleLowerCase()) &&
      (filterSelectValue
        ? filterSelectValue === "condo"
          ? ["condoWarning", "condoAssembly"].includes(item.type)
          : item.type === "residentWarning"
        : true)
  );

  if (!condoId) return;

  return (
    <section className="space-y-4">
      <div className={twMerge(boxStyle)}>
        <div className="flex items-center justify-between px-8 py-4">
          <h1 className="text-[18px] font-bold sm:text-[24px]">
            <span className="hidden sm:inline">Histórico de avisos</span>
            <span className="inline sm:hidden">Avisos</span>
          </h1>

          <div className="flex items-center gap-x-2">
            <FilterSelect
              filterName="Enviado por"
              className="min-w-[180px]"
              options={[
                { label: "Morador", value: "resident" },
                { label: "Síndico", value: "condo" }
              ]}
              onChange={(value) =>
                setFilterSelectValue(value as "condo" | "resident")
              }
              value={filterSelectValue}
            />
            <Input
              className={
                "min-w-[300px] border border-[#DEE2E6] bg-[#F8F9FA] focus:border-[#DEE2E6]"
              }
              placeholder="Pesquise um aviso pelo título"
              value={filterValue}
              onChange={(e) => setFilterValue(e.target.value)}
            />
          </div>
        </div>
        <span className="block h-[0.5px] w-full bg-black" />
        <div className="mx-auto flex w-11/12 max-w-[1200px] items-center justify-center pb-8 sm:py-8">
          <DataPaginatedTable<any>
            data={filteredData ?? []}
            columns={columns}
          />
        </div>
      </div>
    </section>
  );
};

export default WarningTable;
