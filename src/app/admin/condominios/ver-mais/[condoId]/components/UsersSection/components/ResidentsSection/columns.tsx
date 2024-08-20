import { ColumnDef } from "@tanstack/react-table";

import { ResidentColumnData } from "./types";

export const columns: ColumnDef<ResidentColumnData>[] = [
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ getValue }) => getValue() ?? "Sem dados"
  },
  {
    accessorKey: "name",
    header: "Nome completo",
    cell: ({ getValue }) => getValue() ?? "Sem dados"
  },
  {
    accessorKey: "formation",
    header: "Formação",
    cell: ({ getValue }) => getValue() ?? "Sem dados"
  },
  {
    accessorKey: "apartment",
    header: "Apartamento",
    cell: ({ getValue }) => getValue() ?? "Sem dados"
  }
];
