import { ColumnDef } from "@tanstack/react-table";

import { EmployeeColumnData } from "./types";

export const columns: ColumnDef<EmployeeColumnData>[] = [
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ getValue }) => getValue() ?? "Sem dados"
  },
  {
    accessorKey: "phone",
    header: "Telefone",
    cell: ({ getValue }) => getValue() ?? "Sem dados"
  },
  {
    accessorKey: "occupation",
    header: "Profissão",
    cell: ({ getValue }) => getValue() ?? "Sem dados"
  },
  {
    accessorKey: "name",
    header: "Nome completo",
    cell: ({ getValue }) => getValue() ?? "Sem dados"
  }
];
