import { useState } from "react";

import { ColumnDef } from "@tanstack/react-table";
import { formatToCPF } from "brazilian-values";

import { EmployeeEntity } from "@/common/entities/employee";
import Button from "@/components/atoms/Button/button";

import CreateEmployeeModal from "./components/CreateEmployeeModal/CreateEmployeeModal";

const Edit = ({ data }: { data: EmployeeEntity }) => {
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

      <CreateEmployeeModal
        isOpen={modalOpen}
        onOpenChange={setModalOpen}
        employeeData={data}
      />
    </>
  );
};

export const columns: ColumnDef<EmployeeEntity>[] = [
  {
    header: "Cargo",
    accessorKey: "occupation"
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
    header: "Editar",
    accessorKey: "Editar",
    cell: ({ row }) => <Edit data={row.original} />
  }
];
