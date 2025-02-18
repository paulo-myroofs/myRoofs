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

import { monthsArray } from "@/common/constants/monthsArray";
import { TicketEntity } from "@/common/entities/common/condo/ticket";
import Button from "@/components/atoms/Button/button";
import { DataPaginatedTable } from "@/components/atoms/DataTablePaginated/DataTablePaginated";
import useCondoTickets from "@/hooks/queries/condos/tickets/useCondoTickets";
import useCondo from "@/hooks/queries/condos/useCondo";
import { storageGet } from "@/store/services/storage";
import getLastFiveYears from "@/utils/getLastFiveYears";
import { timestampToDate } from "@/utils/timestampToDate";

import { columns } from "./columns";
import CreateTicketModal from "./components/CreateTicketModal/CreateTicketModal";
import { TicketColumnData } from "./types";

import FilterSelect from "../../../../../../components/atoms/FilterSelect/filterSelect";

const boxStyle = "border border-black rounded-[8px]";

const TicketTable = () => {
  const condoId = storageGet<string>("condoId");
  const [modalOpen, setModalOpen] = useState(false);
  const { data: condo } = useCondo(condoId as string);
  const formationOptions =
    condo?.formationNames?.map((item) => ({
      label: item,
      value: item.toLocaleLowerCase()
    })) ?? [];
  const { data: tickets } = useCondoTickets(condoId as string, (data) =>
    data.map(
      (item: TicketEntity) =>
        ({
          id: item.id,
          year: timestampToDate(item.date).getFullYear().toString(),
          month: monthsArray[timestampToDate(item.date).getMonth()],
          apartment: item.apartment,
          status: item.status,
          category: item.category,
          formation: item.formationName,
          file: item.fileUrl,
          condoId
        }) as TicketColumnData
    )
  );
  const categoryOptions = Array.from(
    new Set<string>((tickets ?? []).map((item: TicketEntity) => item.category))
  ).map((cat) => ({
    label: cat,
    value: cat.toLocaleLowerCase()
  }));

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data: tickets ?? [],
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
          <h1 className="text-[18px] font-bold sm:text-[24px]">Boletos</h1>
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
            options={monthsArray.map((item) => ({
              label: item,
              value: item.toLocaleLowerCase()
            }))}
            filterName="Mês"
            value={(table.getColumn("month")?.getFilterValue() as string) ?? ""}
            onChange={(value) =>
              table.getColumn("month")?.setFilterValue(value)
            }
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
          <FilterSelect
            options={categoryOptions}
            filterName="Categoria"
            value={
              (table.getColumn("category")?.getFilterValue() as string) ?? ""
            }
            onChange={(value) =>
              table.getColumn("category")?.setFilterValue(value)
            }
          />
        </div>
        <div className="mx-auto flex w-11/12 max-w-[1200px] items-center justify-center pb-8 sm:py-8">
          <DataPaginatedTable<TicketColumnData>
            data={tickets ?? []}
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
          <PlusIcon size={20} /> Registrar Boleto{" "}
        </Button>
      </div>

      <CreateTicketModal
        condoId={condoId}
        isOpen={modalOpen}
        onOpenChange={setModalOpen}
      />
    </section>
  );
};

export default TicketTable;
