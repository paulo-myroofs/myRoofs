import { useState } from "react";

import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

import { OccurrenceEntity } from "@/common/entities/occurrences";
import Button from "@/components/atoms/Button/button";
import Tag from "@/components/atoms/Tag/Tag";
import TransitionModal from "@/components/atoms/TransitionModal/tempModal";
import useProfile from "@/hooks/queries/useProfile";
import { extractFilename } from "@/utils/extractFilename";

const GetUserName = ({ userId }: { userId: string }) => {
  const { data: name } = useProfile(userId, (data) => data.name);
  return <p>{name}</p>;
};
const GetStatus = ({ status }: { status: OccurrenceEntity["status"] }) => {
  return (
    <Tag
      variant={
        status === "encerrado"
          ? "greenBlack"
          : status === "recusado"
            ? "red"
            : "yellowBlack"
      }
      size="smLarge"
    >
      {status.slice(0, 1).toUpperCase() + status.slice(1)}
    </Tag>
  );
};

const SeeMore = ({ details }: { details: OccurrenceEntity["details"] }) => {
  const [modalOpen, setModalOpen] = useState(false);
  return (
    <>
      <Button
        variant={"outline-black"}
        size="sm"
        onClick={() => setModalOpen(true)}
        className="rounded-sm text-[16px]"
      >
        Ver Mais
      </Button>

      <TransitionModal
        hasButtons={false}
        isOpen={modalOpen}
        onOpenChange={() => setModalOpen((prev) => !prev)}
        title="Detalhes da ocorrência"
      >
        <textarea
          disabled={true}
          rows={4}
          className="w-full items-center gap-1 rounded-sm border border-gray-300 px-2 py-2 text-sm opacity-60 outline-none focus:border-black sm:px-4 sm:text-base"
        >
          {details}
        </textarea>
      </TransitionModal>
    </>
  );
};

export const columns: ColumnDef<OccurrenceEntity>[] = [
  {
    accessorKey: "title",
    header: "Título",
    cell: ({ getValue }) => getValue() ?? "Sem dados"
  },
  {
    accessorKey: "Denuciante",
    header: "Autor",
    cell: ({ row }) => <GetUserName userId={row.original.userId} />
  },
  {
    accessorKey: "image",
    header: "Imagem",
    cell: ({ row }) =>
      row.original.upload ? (
        <Link
          href={row.original.upload}
          target="_blank"
          className="block w-[200px] truncate text-[#2A27CE] underline"
        >
          {extractFilename(row.original.upload)}
        </Link>
      ) : (
        "Sem dados"
      )
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
    accessorKey: "month",
    header: "Status",
    cell: ({ row }) => <GetStatus status={row.original.status} />
  },
  {
    accessorKey: "detalhes",
    header: "Detalhes",
    cell: ({ row }) => <SeeMore details={row.original.details} />
  }
];
