import { useState } from "react";

import { ColumnDef } from "@tanstack/react-table";
import { formatToCPF } from "brazilian-values";

import { ResidentEntity } from "@/common/entities/resident";
import Button from "@/components/atoms/Button/button";

import SeeDetails from "./components/SeeDetails/SeeDetails";

const SeeMore = ({ data }: { data: ResidentEntity }) => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <Button
        variant={"outline-black"}
        size="sm"
        onClick={() => setModalOpen(true)}
        className="rounded-sm text-[14px] md:text-[16px]"
      >
        Ver Mais
      </Button>

      <SeeDetails
        isOpen={modalOpen}
        onOpenChange={setModalOpen}
        residentData={data}
      />
    </>
  );
};

export const columns: ColumnDef<ResidentEntity>[] = [
  {
    header: "Formação",
    accessorKey: "formationName"
  },
  {
    header: "Apartamento",
    accessorKey: "housingName"
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
    header: "Detalhes",
    accessorKey: "details",
    cell: ({ row }) => <SeeMore data={row.original} />
  }
];
