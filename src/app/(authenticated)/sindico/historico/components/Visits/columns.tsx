import { ColumnDef } from "@tanstack/react-table";

import { VisitEntity } from "@/common/entities/visits";
import formatToPhoneMask from "@/utils/formatToPhoneMask";
import { timestampToDate } from "@/utils/timestampToDate";

export const columns: ColumnDef<VisitEntity>[] = [
  {
    accessorKey: "name",
    header: "Nome",
    cell: ({ getValue }) => getValue() ?? "Sem dados"
  },
  {
    accessorKey: "phone",
    header: "Telefone",
    cell: ({ getValue }) =>
      formatToPhoneMask(getValue() as string) ?? "Sem dados"
  },
  {
    accessorKey: "date",
    header: "Data",
    cell: ({ row }) =>
      row.original.date
        ? timestampToDate(row.original.date).toLocaleDateString()
        : "Sem dados"
  },
  {
    accessorKey: "visitType",
    header: "Tipo",
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
