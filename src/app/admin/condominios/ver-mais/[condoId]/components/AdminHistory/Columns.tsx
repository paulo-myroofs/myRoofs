import { ColumnDef } from "@tanstack/react-table";
import { formatToCPF } from "brazilian-values";

import { AptManagerEntity } from "@/common/entities/aptManager";

export const columns: ColumnDef<AptManagerEntity>[] = [
  {
    header: "Cargo",
    accessorKey: "positionOptions"
  },
  {
    header: "Nome",
    accessorKey: "name"
  },
  {
    header: "CPF",
    accessorKey: "cpf",
    cell: ({ row }) =>
      row.original.cpf ? formatToCPF(row.original.cpf) : "Sem dados"
  },
  {
    header: "E-mail",
    accessorKey: "email"
  }
];
