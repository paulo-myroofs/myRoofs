/* eslint-disable @typescript-eslint/no-explicit-any */
import { ColumnDef } from "@tanstack/react-table";

export interface TableSectionProps<T> {
  title: string;
  data: T[];
  columns: ColumnDef<T, any>[];
}
