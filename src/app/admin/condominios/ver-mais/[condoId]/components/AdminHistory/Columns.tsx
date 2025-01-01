// import { useState } from "react";

import { useState } from "react";

import { ColumnDef } from "@tanstack/react-table";
import { formatToCPF } from "brazilian-values";

import { AptManagerEntity, Status } from "@/common/entities/aptManager";
import Button from "@/components/atoms/Button/button";
import Tag from "@/components/atoms/Tag/Tag";
import { errorToast, successToast } from "@/hooks/useAppToast";
import { queryClient } from "@/store/providers/queryClient";
import { updateFirestoreDoc } from "@/store/services";
import { activateUserAuth, deactivateUserAuth } from "@/store/services/auth";

import AptManagerModal from "./editAdmin";

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
      />
    </>
  );
};

const GetStatus = ({ data }: { data: AptManagerEntity }) => {
  const handleUpdate = async () => {
    const curStatus = data.status;
    let nextStatus =
      curStatus === Status.ACTIVE
        ? Status.INACTIVE
        : curStatus === Status.INACTIVE
          ? Status.ACTIVE
          : Status.UNDEFINED;
    if (curStatus === Status.UNDEFINED) {
      nextStatus = Status.ACTIVE;
    }
    const { error } = await updateFirestoreDoc<AptManagerEntity>({
      documentPath: `/users/${data.id}`,
      data: { status: nextStatus }
    });

    if (curStatus === Status.ACTIVE && nextStatus === Status.INACTIVE) {
      const { error } = await deactivateUserAuth(data.id);
      return error;
    } else if (curStatus === Status.INACTIVE && nextStatus === Status.ACTIVE) {
      const { error } = await activateUserAuth(data.id);
      return error;
    }

    if (error) {
      return errorToast("Erro ao atualizar o status do administrador");
    }

    successToast("Status do administrador atualizado com sucesso");
    queryClient.invalidateQueries(["users", data.id]);
  };

  return (
    <Tag
      variant={
        data.status === Status.ACTIVE
          ? "greenBlack"
          : data.status === Status.INACTIVE
            ? "red"
            : "yellowBlack"
      }
      size="smLarge"
      onClick={handleUpdate}
      className="cursor-pointer transition-transform hover:scale-105"
    >
      {data.status
        ? data.status.charAt(0).toUpperCase() +
          data.status.slice(1).toLowerCase()
        : "Status Indefinido"}
    </Tag>
  );
};

export const columns: ColumnDef<AptManagerEntity>[] = [
  { header: "Cargo", accessorKey: "adminRole" },
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
    accessorKey: "month",
    header: "Status",
    cell: ({ row }) => <GetStatus data={row.original} />
  },
  {
    header: "Editar",
    accessorKey: "Editar",
    cell: ({ row }) => <Edit data={row.original} />
  }
];
