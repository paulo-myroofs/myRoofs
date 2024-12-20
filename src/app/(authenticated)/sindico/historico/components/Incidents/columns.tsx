import { useState } from "react";

import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

import { OccurrenceEntity, Status } from "@/common/entities/occurrences";
import Button from "@/components/atoms/Button/button";
import Tag from "@/components/atoms/Tag/Tag";
import TransitionModal from "@/components/atoms/TransitionModal/tempModal";
import useProfile from "@/hooks/queries/useProfile";
import { errorToast, successToast } from "@/hooks/useAppToast";
import { queryClient } from "@/store/providers/queryClient";
import { updateFirestoreDoc } from "@/store/services";
import { extractFilename } from "@/utils/extractFilename";

import { OccurrenceColumnData } from "./types";

const GetUserName = ({ userId }: { userId: string }) => {
  const { data: name } = useProfile(userId, (data) => data.name);
  return <p>{name}</p>;
};

const GetStatus = ({ data }: { data: OccurrenceColumnData }) => {
  const handleUpdate = async () => {
    const nextStatus =
      data.status === Status.CLOSED
        ? Status.WAITING
        : data.status === Status.WAITING
          ? Status.REFUSED
          : Status.CLOSED;

    const { error } = await updateFirestoreDoc<OccurrenceEntity>({
      documentPath: `/occurrences/${data.id}`,
      data: { status: nextStatus }
    });

    if (error) {
      return errorToast("Erro ao atualizar o status da ocorrência");
    }

    successToast("Status da ocorrência atualizado com sucesso");
    queryClient.invalidateQueries(["occurrences", data.condoId]);
  };

  return (
    <Tag
      variant={
        data.status === Status.CLOSED
          ? "greenBlack"
          : data.status === Status.REFUSED
            ? "red"
            : "yellowBlack"
      }
      size="smLarge"
      onClick={handleUpdate}
      className="cursor-pointer transition-transform hover:scale-105"
    >
      {data.status.charAt(0).toUpperCase() + data.status.slice(1).toLowerCase()}
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

export const columns: ColumnDef<OccurrenceColumnData>[] = [
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
    cell: ({ row }) => <GetStatus data={row.original} />
  },
  {
    accessorKey: "detalhes",
    header: "Detalhes",
    cell: ({ row }) => <SeeMore details={row.original.details} />
  }
];
