import { useState } from "react";

import { ColumnDef } from "@tanstack/react-table";
import { formatToCPF } from "brazilian-values";

import { AdministratorEntity } from "@/common/entities/administrator";
import Button from "@/components/atoms/Button/button";
import { positionOptions } from "@/common/constants/positionOptions";
import Tag from "@/components/atoms/Tag/Tag";

import CreateAdministratorModal from "./components/CreateAdminstratorModal";

const GetAdminStatus = ({ isActive }: { isActive: boolean }) => {
  return (
    <Tag variant={isActive ? "greenBlack" : "red"} size="smLarge">
      {isActive ? "Ativo" : "Inativo"}
    </Tag>
  );
};

const Edit = ({ data }: { data: AdministratorEntity }) => {
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

      <CreateAdministratorModal
        isOpen={modalOpen}
        onOpenChange={setModalOpen}
        administratorData={data}
      />
    </>
  );
};

const getPositionLabel = (value: string) => {
  const position = positionOptions.find(option => option.value === value);
  return position ? position.label : "Cargo não especificado";
};

export const columns: ColumnDef<AdministratorEntity>[] = [
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
    header: "E-mail",
    accessorKey: "email",
  },
  {
    header: "Cargo",
    accessorKey: "positionOptions"
  },
  {
    header: "Status",
    accessorKey: "isActive",
    cell: ({ row }) => <GetAdminStatus isActive={row.original.isActive} />
  }
];