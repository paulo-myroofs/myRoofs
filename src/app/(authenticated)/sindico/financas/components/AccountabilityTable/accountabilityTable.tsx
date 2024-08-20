"use client";

import { useState } from "react";

import {
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable
} from "@tanstack/react-table";
import { PlusIcon } from "lucide-react";
import { twMerge } from "tailwind-merge";

import { InstallmentEntity } from "@/common/entities/common/condo/installment";
import Button from "@/components/atoms/Button/button";
import { DataPaginatedTable } from "@/components/atoms/DataTablePaginated/DataTablePaginated";
import useCondoInstallments from "@/hooks/queries/condos/installments/useCondoInstallments";
import useCondo from "@/hooks/queries/condos/useCondo";
import { storageGet } from "@/store/services/storage";
import getLastFiveYears from "@/utils/getLastFiveYears";

import { columns } from "./columns";
import CreateAccountabilityModal from "./components/CreateAccountabilityModal/CreateAccountabilityModal";

import FilterSelect from "../../../../../../components/atoms/FilterSelect/filterSelect";

const boxStyle = "border border-black rounded-[8px]";

const AccountabilityTable = () => {
  const condoId = storageGet<string>("condoId");
  const [modalOpen, setModalOpen] = useState(false);
  const { data: condo } = useCondo(condoId as string);
  const formationOptions =
    condo?.formationNames?.map((item) => ({
      label: item,
      value: item.toLocaleLowerCase()
    })) ?? [];
  const { data: installments } = useCondoInstallments(condoId as string);

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data: installments ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 6
      }
    },
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      columnFilters
    }
  });

  if (!condoId) return;

  return (
    <section className="space-y-4">
      <div className={twMerge(boxStyle)}>
        <div className="flex items-center justify-between px-8 py-4">
          <h1 className="text-[18px] font-bold sm:text-[24px]">
            Prestação de Contas
          </h1>
        </div>
        <span className="block h-[0.5px] w-full bg-black" />
        <div className="flex flex-wrap gap-x-4 gap-y-2 px-8 py-4">
          <FilterSelect
            options={getLastFiveYears().map((item) => ({
              label: item.toString(),
              value: item.toString()
            }))}
            filterName="Ano"
            value={(table.getColumn("year")?.getFilterValue() as string) ?? ""}
            onChange={(value) => table.getColumn("year")?.setFilterValue(value)}
          />
          <FilterSelect
            options={formationOptions}
            filterName="Formação"
            value={
              (table.getColumn("formation")?.getFilterValue() as string) ?? ""
            }
            onChange={(value) =>
              table.getColumn("formation")?.setFilterValue(value)
            }
          />
        </div>
        <div className="mx-auto flex w-11/12 max-w-[1200px] items-center justify-center pb-8 sm:py-8">
          <DataPaginatedTable<InstallmentEntity>
            data={installments ?? []}
            columns={columns}
            optionalTable={table}
          />
        </div>
      </div>

      <div className="flex w-full justify-end">
        <Button
          className=""
          variant="note"
          size="lg"
          onClick={() => setModalOpen(true)}
        >
          {" "}
          <PlusIcon size={20} /> Registrar Prestação{" "}
        </Button>
      </div>

      <CreateAccountabilityModal
        condoId={condoId}
        isOpen={modalOpen}
        onOpenChange={setModalOpen}
      />
    </section>
  );
};

export default AccountabilityTable;
