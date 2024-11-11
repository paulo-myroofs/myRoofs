import { ColumnDef } from "@tanstack/react-table";
import { formatToCPF } from "brazilian-values";

import { AdministratorEntity } from "@/common/entities/administrator";

export const columns: ColumnDef<AdministratorEntity>[] = [
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
