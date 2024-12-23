import { useState } from "react";

import { ColumnDef } from "@tanstack/react-table";

import { columns } from "@/app/(authenticated)/sindico/historico/components/LostAndFound/columns";
import { LostFound } from "@/common/entities/lostAndFound";
import Button from "@/components/atoms/Button/button";
import Tag from "@/components/atoms/Tag/Tag";

import CreateLostFoundModal from "../components/CreateLostFoundModal/CreateLostFoundModal";
import ValidateDeliverLostFound from "../components/ValidateDeliverLostFound/ValidateDeliverLostFound";

const Validate = ({ lostFoundData }: { lostFoundData: LostFound }) => {
  const [modalOpen, setModalOpen] = useState(false);

  if (lostFoundData.deliveredTo) {
    return <Tag size={"smFit"}> Entregue </Tag>;
  }

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
      <ValidateDeliverLostFound
        isOpen={modalOpen}
        onOpenChange={setModalOpen}
        lostFoundData={lostFoundData}
      />
    </>
  );
};

const Edit = ({ lostFoundData }: { lostFoundData: LostFound }) => {
  const [modalOpen, setModalOpen] = useState(false);
  return (
    <>
      <Button
        variant={"outline-black"}
        size="sm"
        className="w-[100px]"
        disabled={!!lostFoundData.deliveredTo}
        onClick={() => setModalOpen(true)}
      >
        Editar
      </Button>
      <CreateLostFoundModal
        isOpen={modalOpen}
        onOpenChange={setModalOpen}
        lostFoundData={lostFoundData}
      />
    </>
  );
};

const finalColumns = [
  ...columns.filter((column) => column.id !== "status"),
  {
    accessorKey: "validate",
    header: "Validar",
    cell: ({ row }) => <Validate lostFoundData={row.original} />
  } as ColumnDef<LostFound>,
  {
    accessorKey: "edit",
    header: "Editar",
    cell: ({ row }) => <Edit lostFoundData={row.original} />
  } as ColumnDef<LostFound>
];

export default finalColumns;
