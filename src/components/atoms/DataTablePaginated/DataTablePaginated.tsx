/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  Table as TableType,
  useReactTable
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";

export function DataPaginatedTable<T>({
  data,
  columns,
  optionalTable
}: {
  data: T[];
  columns: ColumnDef<T, any>[];
  optionalTable?: TableType<T>;
}) {
  const basicTableData = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    initialState: {
      pagination: {
        pageSize: data.length
      }
    }
  });

  const table = (optionalTable ?? basicTableData) as TableType<T>;

  return (
    <div className="w-full space-y-4">
      {/* HORIZONTAL TABLE */}
      <div className="hidden rounded-md border border-black md:block">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Sem resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* VERTICAL TABLE */}
      <div className="block w-full space-y-4 md:hidden">
        <div className="space-y-2 rounded-md border border-black p-4">
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <div
                key={row.id}
                className="flex flex-col space-y-2 border-b-2 py-4 last:border-b-0 last:pb-0"
              >
                {row.getVisibleCells().map((cell) => (
                  <div key={cell.id} className="flex pb-1 last:pb-0">
                    <div className="w-1/3 text-[14px] font-bold sm:text-base">
                      {flexRender(
                        cell.column.columnDef.header,
                        cell.getContext() as any
                      )}
                    </div>
                    <div className="flex w-2/3 justify-end text-[14px] sm:text-base">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ))
          ) : (
            <div className="text-center">Sem resultados.</div>
          )}
        </div>
      </div>
    </div>
  );
}
