// import { useState } from "react";

import { useState, useEffect } from "react";

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
  const [loading, setLoading] = useState(false);
  const [optimisticStatus, setOptimisticStatus] = useState<string | undefined>(
    data.status
  );
  useEffect(() => {
    setOptimisticStatus(data.status);
  }, [data.status]);

  const handleUpdate = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const curStatus = optimisticStatus;
      const nextStatus =
        curStatus === Status.ACTIVE ? Status.INACTIVE : Status.ACTIVE;
      setOptimisticStatus(nextStatus);
      await updateFirestoreDoc<AptManagerEntity>({
        documentPath: `/users/${data.id}`,
        data: { status: nextStatus }
      });
      if (curStatus === Status.ACTIVE) {
        await deactivateUserAuth(data.id);
      } else {
        await activateUserAuth(data.id);
      }
      await queryClient.invalidateQueries(["users", data.id]);
      successToast("Status do administrador atualizado com sucesso");
    } catch (error) {
      setOptimisticStatus(data.status);
      errorToast(
        error instanceof Error
          ? error.message
          : "Erro ao atualizar o status do administrador"
      );
    } finally {
      setOptimisticStatus(data.status);
      setLoading(false);
    }
  };

  return (
    <Tag
      variant={
        optimisticStatus === Status.ACTIVE
          ? "greenBlack"
          : optimisticStatus === Status.INACTIVE
            ? "red"
            : "yellowBlack"
      }
      size="smLarge"
      onClick={handleUpdate}
      className={`cursor-pointer transition-transform hover:scale-105 ${
        loading ? "cursor-not-allowed opacity-50" : ""
      }`}
    >
      {loading
        ? "Atualizando..."
        : optimisticStatus
          ? optimisticStatus.charAt(0).toUpperCase() +
            optimisticStatus.slice(1).toLowerCase()
          : "Indefinido"}
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
  },
  {
    header: "Data de Criação",
    accessorKey: "createdAt",
    cell: ({ row }) =>
      row.original.createdAt
        ? row.original.createdAt.toDate().toLocaleDateString()
        : "Não disponível"
  },
  {
    header: "Data de Bloqueio",
    accessorKey: "blockedAt",
    cell: ({ row }) =>
      row.original.blockedAt
        ? row.original.blockedAt.toDate().toLocaleDateString()
        : "Não bloqueado"
  }
];
