import { ColumnDef } from "@tanstack/react-table";

import { PetEntity } from "@/common/entities/pet";

export const petColumns: ColumnDef<PetEntity>[] = [
  {
    accessorKey: "species",
    header: "Espécie",
    cell: ({ getValue }) => getValue() ?? "Sem dados"
  },
  {
    accessorKey: "name",
    header: "Nome",
    cell: ({ getValue }) => getValue() ?? "Sem dados"
  },
  {
    accessorKey: "size",
    header: "Tamanho",
    cell: ({ getValue }) => getValue() ?? "Sem dados"
  },
  {
    accessorKey: "breed",
    header: "Raça",
    cell: ({ getValue }) => getValue() ?? "Sem dados"
  }
];
