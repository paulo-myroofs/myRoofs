"use client";
import { useState } from "react";

import { ColumnDef } from "@tanstack/react-table";

import { OrderEntity } from "@/common/entities/order";
import { ResidentEntity } from "@/common/entities/resident";
import AuthEnterModal from "@/components/atoms/AuthEnterModal/AuthEnterModal";
import Button from "@/components/atoms/Button/button";
import Tag from "@/components/atoms/Tag/Tag";
import useProfile from "@/hooks/queries/useProfile";
import { errorToast, successToast } from "@/hooks/useAppToast";
import { queryClient } from "@/store/providers/queryClient";
import { updateFirestoreDoc } from "@/store/services";
import { timestampToDate } from "@/utils/timestampToDate";

import CreateOrderModal from "./components/CreateOrder/CreateOrderModal";

const GetUser = ({ toDeliverId }: { toDeliverId: string }) => {
  const { data: user } = useProfile<ResidentEntity>(toDeliverId);
  return <p>{user?.name}</p>;
};

const EditOrder = ({ order }: { order: OrderEntity }) => {
  const [modalOpen, setModalOpen] = useState(false);
  return (
    <>
      <Button
        variant={"outline-black"}
        size="sm"
        className="w-[100px] disabled:pointer-events-none disabled:opacity-50"
        disabled={order.wasDelivered}
        onClick={() => setModalOpen(true)}
      >
        Editar
      </Button>
      <CreateOrderModal
        isOpen={modalOpen}
        onOpenChange={setModalOpen}
        orderData={order}
      />
    </>
  );
};

const Validate = ({ order }: { order: OrderEntity }) => {
  const { data: user } = useProfile<ResidentEntity>(order.deliverTo);
  const [modalOpen, setModalOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const onConfirm = async () => {
    if (user?.deliveryCode === inputValue) {
      await updateFirestoreDoc({
        documentPath: `/orders/${order.id}`,
        data: { wasDelivered: true }
      });
      queryClient.invalidateQueries(["orders", order.condominiumId]);
      successToast("Entrega validada com sucesso!");
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

export const columns: ColumnDef<OrderEntity>[] = [
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
    accessorKey: "deliveredTo",
    header: "Entregar pra",
    cell: ({ row }) => <GetUser toDeliverId={row.original.deliverTo} />
  },
  {
    accessorKey: "validate",
    header: "Validar encomenda",
    cell: ({ row }) =>
      row.original.wasDelivered ? (
        <Tag size="smFit"> Validada </Tag>
      ) : (
        <Validate order={row.original} />
      )
  },
  {
    accessorKey: "edit",
    header: "Editar",
    cell: ({ row }) => <EditOrder order={row.original} />
  }
];
