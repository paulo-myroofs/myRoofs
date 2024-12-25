// import { useState } from "react";

import { useState } from "react";

import { ColumnDef } from "@tanstack/react-table";
import { formatToCPF } from "brazilian-values";

import { AptManagerEntity } from "@/common/entities/aptManager";
import Button from "@/components/atoms/Button/button";

import AptManagerModal from "./CreateAdmin";
const Edit = ({ data }: { data: AptManagerEntity }) => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <Button
        variant={"outline-black"}
        size="sm"
        onClick={() => setModalOpen(true)}
        className="rounded-sm text-[16px]"
      >
        Editar
      </Button>

      <AptManagerModal
        isOpen={modalOpen}
        onOpenChange={setModalOpen}
        adminData={data}
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        handleNewAdmin={function (newAdmin: AptManagerEntity): void {
          throw new Error("Function not implemented.");
        }}
      />
    </>
  );
};
export const columns: ColumnDef<AptManagerEntity>[] = [
  { header: "Cargo", accessorKey: "role" },
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
    header: "Editar",
    accessorKey: "Editar",
    cell: ({ row }) => <Edit data={row.original} />
  }
];
