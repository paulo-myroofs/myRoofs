import { ColumnDef } from "@tanstack/react-table";

import { AutomobileEntity } from "@/common/entities/automobile";

export const autoColumns: ColumnDef<AutomobileEntity>[] = [
  {
    accessorKey: "type",
    header: "Tipo",
    cell: ({ getValue }) => getValue() ?? "Sem dados"
  },
  {
    accessorKey: "plate",
    header: "Placa",
    cell: ({ getValue }) => getValue() ?? "Sem dados"
  },
  {
    accessorKey: "model",
    header: "Modelo",
    cell: ({ getValue }) => getValue() ?? "Sem dados"
  },
  {
    accessorKey: "brand",
    header: "Marca",
    cell: ({ getValue }) => getValue() ?? "Sem dados"
  }
];
