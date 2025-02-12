import { ColumnDef } from "@tanstack/react-table";
import { formatToCPF } from "brazilian-values";
import { Timestamp } from "firebase/firestore";

import { AptManagerEntity, Status } from "@/common/entities/aptManager";
import Tag from "@/components/atoms/Tag/Tag";

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
    header: "Data de Criação",
    accessorKey: "createdAt",
    cell: ({ row }) => {
      const createdAt = row.original.createdAt;
      const date =
        createdAt instanceof Timestamp
          ? createdAt.toDate()
          : new Date(createdAt);
      return createdAt ? date.toLocaleDateString() : "Não disponível";
    }
  },
  {
    header: "Data de Bloqueio",
    accessorKey: "blockedAt",
    cell: ({ row }) => {
      const blockedAt = row.original.blockedAt;
      const date =
        blockedAt instanceof Timestamp
          ? blockedAt.toDate()
          : blockedAt
            ? new Date(blockedAt)
            : null;
      return date ? date.toLocaleDateString() : "Não bloqueado";
    }
  }
];
