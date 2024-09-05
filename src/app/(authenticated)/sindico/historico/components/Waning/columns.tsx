import { useState } from "react";

import { ColumnDef } from "@tanstack/react-table";

import Button from "@/components/atoms/Button/button";
import { timestampToDate } from "@/utils/timestampToDate";

import { WarningColumnData } from "./types";

import CreateAssemblyModal from "../../../components/Assembly/components/CreateAssemblyWarningModal/CreateAssemblyWarnigModal";
import CreateCondoWarningModal from "../../../components/Condo/components/CreateCondoWarningModal/CreateCondoWarningModal";

const SeeMore = ({ data }: { data: WarningColumnData }) => {
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

      {data.type === "condoAssembly" ? (
        <CreateAssemblyModal
          readOnly
          assemblyData={data}
          onOpenChange={setModalOpen}
          isOpen={modalOpen}
        />
      ) : (
        <CreateCondoWarningModal
          readOnly
          noticeData={data}
          onOpenChange={setModalOpen}
          isOpen={modalOpen}
        />
      )}
    </>
  );
};

export const columns: ColumnDef<WarningColumnData>[] = [
  {
    accessorKey: "about",
    header: "Título",
    cell: ({ row }) => (
      <p className="text-[16px]">{row.original.about ?? "Sem dados"}</p>
    )
  },
  {
    accessorKey: "type",
    header: "Autor",
    cell: ({ row }) => (
      <p className="text-[16px]">
        {row.original.type
          ? row.original.type === "residentWarning"
            ? "Morador"
            : "Síndico"
          : "Sem dados"}
      </p>
    )
  },
  {
    accessorKey: "date",
    header: "Data",
    cell: ({ row }) =>
      row.original.updatedAt
        ? timestampToDate(row.original.updatedAt).toLocaleDateString()
        : "Sem dados"
  },
  {
    accessorKey: "type",
    header: "Tipo",
    cell: ({ row }) =>
      row.original.type === "condoAssembly" ? "Assembleia" : "Aviso"
  },
  {
    accessorKey: "month",
    header: "Conteúdo",
    cell: ({ row }) => <SeeMore data={row.original} />
  }
];
