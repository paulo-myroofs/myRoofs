import { useState } from "react";

import { ColumnDef } from "@tanstack/react-table";

import { VisitEntity } from "@/common/entities/visits";
import AuthEnterModal from "@/components/atoms/AuthEnterModal/AuthEnterModal";
import Button from "@/components/atoms/Button/button";
import Tag from "@/components/atoms/Tag/Tag";
import { errorToast, successToast } from "@/hooks/useAppToast";
import { queryClient } from "@/store/providers/queryClient";
import { updateFirestoreDoc } from "@/store/services";
import formatToPhoneMask from "@/utils/formatToPhoneMask";
import { timestampToDate } from "@/utils/timestampToDate";

import CreateVisitsModal from "./components/CreateVisitsModal";

const Validate = ({ visitData }: { visitData: VisitEntity }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const onConfirm = async () => {
    if (visitData.validationCode === inputValue) {
      await updateFirestoreDoc({
        documentPath: `/visits/${visitData.id}`,
        data: { wasValidated: true }
      });
      queryClient.invalidateQueries(["visits", visitData.condominiumId]);
      successToast("Check-in realizado com sucesso!");
    } else {
      errorToast("Código não é válido.");
    }
  };

  return (
    <>
      <Button
        variant={"outline-black"}
        size="sm"
        className="w-[100px]"
        onClick={() => setModalOpen(true)}
      >
        Validar
      </Button>
      <AuthEnterModal
        isOpen={modalOpen}
        onOpenChange={setModalOpen}
        inputValue={inputValue}
        setInputValue={setInputValue}
        onConfirm={onConfirm}
        onCancel={() => setInputValue("")}
      />
    </>
  );
};

const Edit = ({ visitData }: { visitData: VisitEntity }) => {
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
      <CreateVisitsModal
        isOpen={modalOpen}
        onOpenChange={setModalOpen}
        visitData={visitData}
      />
    </>
  );
};

export const columns: ColumnDef<VisitEntity>[] = [
  {
    accessorKey: "name",
    header: "Nome",
    cell: ({ getValue }) => getValue() ?? "Sem dados"
  },
  {
    accessorKey: "phone",
    header: "Telefone",
    cell: ({ getValue }) =>
      formatToPhoneMask(getValue() as string) ?? "Sem dados"
  },
  {
    accessorKey: "date",
    header: "Data",
    cell: ({ row }) => (
      <p>
        {row.original.date
          ? timestampToDate(row.original.date).toLocaleDateString()
          : "Sem dados"}
      </p>
    )
  },
  {
    accessorKey: "visitType",
    header: "Tipo",
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
    accessorKey: "code",
    header: "Validar Visitante",
    cell: ({ row }) =>
      row.original.wasValidated ? (
        <Tag size="smFit"> Validado </Tag>
      ) : (
        <Validate visitData={row.original} />
      )
  },
  {
    accessorKey: "edit",
    header: "Editar",
    cell: ({ row }) => <Edit visitData={row.original} />
  }
];
