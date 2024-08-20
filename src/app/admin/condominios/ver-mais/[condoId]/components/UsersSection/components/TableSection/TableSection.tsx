import { twMerge } from "tailwind-merge";

import { DataPaginatedTable } from "@/components/atoms/DataTablePaginated/DataTablePaginated";

import { TableSectionProps } from "./types";

const boxStyle = "border border-black rounded-[8px]";

const TableSection = <T,>({ title, data, columns }: TableSectionProps<T>) => {
  return (
    <div className={twMerge(boxStyle)}>
      <div className="flex items-center justify-between px-8 py-4">
        <h1 className="text-[18px] font-bold sm:text-[24px]">{title}</h1>
        <div
          className={twMerge(
            boxStyle,
            "rounded-sm px-3 py-2  text-sm sm:px-6 sm:text-[18px]"
          )}
        >
          {`Total: ${data.length}`}
        </div>
      </div>
      <span className="block h-[0.5px] w-full bg-black" />
      <div className="mx-auto flex w-11/12 max-w-[1200px] items-center justify-center py-8">
        <DataPaginatedTable<T> data={data} columns={columns} />
      </div>
    </div>
  );
};

export default TableSection;
