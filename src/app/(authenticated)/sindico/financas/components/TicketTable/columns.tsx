import { ColumnDef } from "@tanstack/react-table";

import { TicketEntity } from "@/common/entities/common/condo/ticket";
import TagAtom from "@/components/atoms/Tag/Tag";
import { errorToast, successToast } from "@/hooks/useAppToast";
import { queryClient } from "@/store/providers/queryClient";
import { updateFirestoreDoc } from "@/store/services";
import { extractFilename } from "@/utils/extractFilename";

import { TicketColumnData } from "./types";

const StatusCell = ({ data }: { data: TicketColumnData }) => {
  const handleUpdate = async () => {
    const { error } = await updateFirestoreDoc<TicketEntity>({
      documentPath: `/tickets/${data.id}`,
      data: { status: data.status === "confirmed" ? "pending" : "confirmed" }
    });

    if (error) {
      return errorToast("Não foi possível atualizar status do boleto.");
    }
    successToast("Status do boleto atualizado com sucesso.");
    queryClient.invalidateQueries(["tickets", data.condoId]);
  };

  return (
    (
      <TagAtom
        variant={data.status === "confirmed" ? "greenBlack" : "red"}
        size="smFit"
        onClick={handleUpdate}
        className="cursor-pointer hover:scale-105"
      >
        {data.status === "confirmed" ? "Confirmado" : "Pendente"}
      </TagAtom>
    ) ?? "Sem dados"
  );
};

export const columns: ColumnDef<TicketColumnData>[] = [
  {
    accessorKey: "year",
    header: "Ano",
    cell: ({ getValue }) => getValue() ?? "Sem dados"
  },
  {
    accessorKey: "month",
    header: "Mês",
    cell: ({ getValue }) => getValue() ?? "Sem dados"
  },
  {
    accessorKey: "category",
    header: "Categoria",
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
  },
  {
    accessorKey: "file",
    header: "Arquivo",
    cell: ({ row }) =>
      row.original.file ? (
        <a
          href={row.original.file}
          target="_blank"
          className="max-w-[200px] truncate hover:underline"
        >
          {" "}
          {extractFilename(row.original.file)}{" "}
        </a>
      ) : (
        "Sem dados"
      )
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusCell data={row.original} />
  }
];
