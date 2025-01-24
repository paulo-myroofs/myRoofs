import { useState } from "react";

import { ColumnDef } from "@tanstack/react-table";

import { BookingEntity } from "@/common/entities/booking";
import { ResidentEntity } from "@/common/entities/resident";
import Button from "@/components/atoms/Button/button";
import useProfile from "@/hooks/queries/useProfile";
import { timestampToDate } from "@/utils/timestampToDate";

import SeeDetails from "./components/SeeDetails/SeeDetails";

const GetUser = ({ userId }: { userId: string }) => {
  const { data: user } = useProfile<ResidentEntity>(userId);
  return <p>{user?.name ?? "Sem dados"}</p>;
};

const SeeFiles = ({ data }: { data: BookingEntity }) => {
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

      <SeeDetails
        isOpen={modalOpen}
        onOpenChange={setModalOpen}
        bookingData={data}
      />
    </>
  );
};

const GetDatePeriod = ({ data }: { data: BookingEntity }) => {
  const { dates, periods } = data;
  const dateString = timestampToDate(dates).toLocaleDateString();
  const auxTranslate = {
    morning: "Manhã",
    afternoon: "Tarde",
    night: "Noite"
  };

  const periodsString = periods?.map((item) => auxTranslate[item]).join(", ");

  return (
    <p>
      {dateString} {periodsString ? `- ${periodsString}` : ""}
    </p>
  );
};

export const columns: ColumnDef<BookingEntity>[] = [
  {
    accessorKey: "area",
    header: "Área reservada",
    cell: ({ getValue }) => getValue() ?? "Sem dados"
  },
  {
    accessorKey: "reservedId",
    header: "Reserva feita por",
    cell: ({ row }) => <GetUser userId={row.original.userId} />
  },
  {
    accessorKey: "block",
    header: "Formação",
    cell: ({ getValue }) => getValue() ?? "Sem dados"
  },
  {
    accessorKey: "apartment",
    header: "Apartamento",
    cell: ({ getValue }) => getValue() ?? "Sem dados"
  },
  {
    accessorKey: "date",
    header: "Data e turno",
    cell: ({ row }) => <GetDatePeriod data={row.original} />
  },
  {
    accessorKey: "deliveredTo",
    header: "Arquivos",
    cell: ({ row }) => <SeeFiles data={row.original} />
  }
];
