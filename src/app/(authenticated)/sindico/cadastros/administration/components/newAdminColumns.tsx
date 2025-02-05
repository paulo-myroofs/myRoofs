import { ColumnDef } from "@tanstack/react-table";
import { formatToCPF } from "brazilian-values";

import { AptManagerEntity, Status } from "@/common/entities/aptManager";
import Tag from "@/components/atoms/Tag/Tag";
import { timestampToDate } from "@/utils/timestampToDate";

const GetStatus = ({ data }: { data: AptManagerEntity }) => {
  return (
    <Tag
      variant={
        data.status === Status.ACTIVE
          ? "greenBlack"
          : data.status === Status.INACTIVE
            ? "red"
            : "yellowBlack"
      }
      size="smLarge"
      className="transition-transform"
    >
      {data.status
        ? data.status.charAt(0).toUpperCase() +
          data.status.slice(1).toLowerCase()
        : "Indefinido"}
    </Tag>
  );
};

export const columns: ColumnDef<AptManagerEntity>[] = [
  {
    header: "Cargo",
    accessorKey: "adminRole"
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
    header: "Email",
    accessorKey: "email"
  },
  {
    header: "Status",
    accessorKey: "month",
    cell: ({ row }) => <GetStatus data={row.original} />
  },
  {
    header: "Data de Início",
    accessorKey: "createdAt",
    cell: ({ row }) => (
      <p>
        {row.original.createdAt
          ? timestampToDate(row.original.createdAt).toLocaleDateString()
          : ""}
      </p>
    )
  },
  {
    header: "Data de Bloqueio",
    accessorKey: "blockedAt"
  }
];
