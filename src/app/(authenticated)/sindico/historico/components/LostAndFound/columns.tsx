import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

import { LostFound } from "@/common/entities/lostAndFound";
import { ResidentEntity } from "@/common/entities/resident";
import Tag from "@/components/atoms/Tag/Tag";
import useProfile from "@/hooks/queries/useProfile";
import { extractFilename } from "@/utils/extractFilename";

const GetUserName = ({ userId }: { userId: string | null }) => {
  const { data: user } = useProfile<ResidentEntity>(userId ?? "");
  return <p>{user?.name ?? "Sem dados"}</p>;
};

const GetStatus = ({ status }: { status: "Confirmado" | "Pendente" }) => {
  return (
    <Tag
      variant={status === "Confirmado" ? "greenBlack" : "red"}
      size="smLarge"
    >
      {status.slice(0, 1).toUpperCase() + status.slice(1)}
    </Tag>
  );
};

export const columns: ColumnDef<LostFound>[] = [
  {
    accessorKey: "description",
    header: "Descrição",
    cell: ({ getValue }) => getValue() ?? "Sem dados"
  },
  {
    accessorKey: "imagem",
    header: "Imagem",
    cell: ({ row }) =>
      row.original.imageUrl ? (
        <Link
          href={row.original.imageUrl}
          target="_blank"
          className="block w-[200px] truncate text-[#2A27CE] underline"
        >
          {extractFilename(row.original.imageUrl)}
        </Link>
      ) : (
        "Sem dados"
      )
  },
  {
    accessorKey: "foundLocal",
    header: "Encontrado em",
    cell: ({ getValue }) => getValue() ?? "Sem dados"
  },
  {
    accessorKey: "date",
    header: "Data",
    cell: ({ row }) =>
      row.original.date ? (
        <p>{new Date(row.original.date.seconds * 1000).toLocaleDateString()}</p>
      ) : (
        "Sem dados"
      )
  },
  {
    accessorKey: "deliveredTo",
    header: "Entregue a",
    cell: ({ row }) => <GetUserName userId={row.original.deliveredTo} />
  },
  {
    id: "status",
    accessorKey: "status",
    header: "Status de Entrega",
    cell: ({ row }) => (
      <GetStatus
        status={row.original.deliveredTo ? "Confirmado" : "Pendente"}
      />
    )
  }
];
