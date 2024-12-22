// import { useState } from "react";

import { ColumnDef } from "@tanstack/react-table";
import { formatToCPF } from "brazilian-values";
import { Edit } from "lucide-react";

import { AptManagerEntity } from "@/common/entities/aptManager";

export const columns: ColumnDef<AptManagerEntity>[] = [
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
    header: "Email",
    accessorKey: "email"
  },
  {
    header: "Empresa",
    accessorKey: "companyId"
  },
  {
    header: "Editar",
    accessorKey: "Editar",
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    cell: ({ row }) => <Edit />
  }
];
