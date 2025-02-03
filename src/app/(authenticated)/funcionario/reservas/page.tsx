/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";

import { twMerge } from "tailwind-merge";

import { BookingEntity } from "@/common/entities/booking";
import { EmployeeEntity } from "@/common/entities/employee";
import { DataPaginatedTable } from "@/components/atoms/DataTablePaginated/DataTablePaginated";
import Input from "@/components/atoms/Input/input";
import useBookingByCondoId from "@/hooks/queries/bookings/useBookingsByCondoId";
import useProfile from "@/hooks/queries/useProfile";
import useAuth from "@/hooks/useAuth";

import { columns } from "./columns";

const boxStyle = "border border-black rounded-[8px]";

const Reservas = () => {
  const { userUid } = useAuth();
  const { data: user } = useProfile<EmployeeEntity>(userUid);
  const [filterValue, setFilterValue] = useState("");
  const { data: bookingData } = useBookingByCondoId(
    user?.condominiumCode as string
  );
  const filteredData = bookingData?.filter((item) =>
    item.area?.toLocaleLowerCase().includes(filterValue.toLocaleLowerCase())
  );

  return (
    <section className="mx-auto w-11/12 max-w-[1500px] space-y-4">
      <div className="space-y-4">
        <div className={twMerge(boxStyle)}>
          <div className="flex items-center justify-between px-8 py-4">
            <h1 className="text-[18px] font-bold sm:text-[24px]">
              Histórico de Reservas
            </h1>

            <Input
              className={
                "max-w-[300px] border border-[#DEE2E6] bg-[#F8F9FA] hover:border-[#DEE2E6]"
              }
              placeholder="Pesquise pela área reservada"
              value={filterValue}
              onChange={(e) => setFilterValue(e.target.value)}
            />
          </div>
          <span className="block h-[0.5px] w-full bg-black" />
          <div className="mx-auto flex w-11/12 max-w-[1200px] items-center justify-center pb-8 sm:py-8">
            <DataPaginatedTable<BookingEntity>
              data={filteredData ?? []}
              columns={columns}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Reservas;
