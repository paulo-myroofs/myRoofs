import { useState } from "react";

import { ColumnDef } from "@tanstack/react-table";

import { monthsArray } from "@/common/constants/monthsArray";
import { InstallmentEntity } from "@/common/entities/common/condo/installment";
import Button from "@/components/atoms/Button/button";
import { storageGet } from "@/store/services/storage";
import { extractFilename } from "@/utils/extractFilename";
import { timestampToDate } from "@/utils/timestampToDate";

import CreateAccountabilityModal from "./components/CreateAccountabilityModal/CreateAccountabilityModal";

const Edit = ({ data }: { data: InstallmentEntity }) => {
  const condoId = storageGet<string>("condoId") as string;
  const [modalOpen, setModalOpen] = useState(false);
  return (
    <>
      <Button
        variant={"outline-black"}
        size="sm"
        className="w-[100px]"
        onClick={() => setModalOpen(true)}
      >
        Editar
      </Button>
      <CreateAccountabilityModal
        isOpen={modalOpen}
        onOpenChange={setModalOpen}
        condoId={condoId}
        installmentData={data}
      />
    </>
  );
};

export const columns: ColumnDef<InstallmentEntity>[] = [
  {
    accessorKey: "year",
    header: "Ano",
    cell: ({ row }) => (
      <p>
        {row.original.date
          ? timestampToDate(row.original.date).getFullYear()
          : "Sem dados"}
      </p>
    )
  },
  {
    accessorKey: "month",
    header: "Mês",
    cell: ({ row }) => (
      <p>
        {row.original.date
          ? monthsArray[timestampToDate(row.original.date).getMonth()]
          : "Sem dados"}
      </p>
    )
  },
  {
    accessorKey: "formation",
    header: "Formação",
    cell: ({ getValue }) => getValue() ?? "Sem dados"
  },
  {
    accessorKey: "fileUrl",
    header: "Arquivo",
    cell: ({ row }) =>
      row.original.fileUrl ? (
        <a
          href={row.original.fileUrl}
          target="_blank"
          className="max-w-[200px] truncate hover:underline"
        >
          {" "}
          {extractFilename(row.original.fileUrl)}{" "}
        </a>
      ) : (
        "Sem dados"
      )
  },
  {
    accessorKey: "edit",
    header: "Editar",
    cell: ({ row }) => <Edit data={row.original} />
  }
];
