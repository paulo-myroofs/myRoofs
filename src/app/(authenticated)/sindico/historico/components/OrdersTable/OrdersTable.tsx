"use client";

import { useState } from "react";

import { PlusIcon } from "lucide-react";
import { twMerge } from "tailwind-merge";

import { EmployeeEntity } from "@/common/entities/employee";
import { OrderEntity } from "@/common/entities/order";
import Button from "@/components/atoms/Button/button";
import { DataPaginatedTable } from "@/components/atoms/DataTablePaginated/DataTablePaginated";
import Input from "@/components/atoms/Input/input";
import useOrdersByCondoId from "@/hooks/queries/orders/useOrdersByCondoId";
import useProfile from "@/hooks/queries/useProfile";
import useAuth from "@/hooks/useAuth";

import { columns } from "./columns";
import CreateOrderModal from "./components/CreateOrder/CreateOrderModal";

const boxStyle = "border border-black rounded-[8px]";

const OrdersTable = () => {
  const { userUid } = useAuth();
  const { data: user } = useProfile<EmployeeEntity>(userUid);
  const [modalOpen, setModalOpen] = useState(false);
  const [filterValue, setFilterValue] = useState("");

  const { data: orders } = useOrdersByCondoId(user?.condominiumCode);
  const filteredData = orders?.filter((item) =>
    item.apartment.toLocaleLowerCase().includes(filterValue.toLocaleLowerCase())
  );

  return (
    <section className="space-y-4">
      <div className={twMerge(boxStyle)}>
        <div className="flex flex-col items-center justify-between gap-y-2 px-8 py-4 sm:flex-row">
          <h1 className="text-[18px] font-bold sm:text-[24px]">Encomendas</h1>
          <Input
            className={
              "w-full border border-[#DEE2E6] bg-[#F8F9FA] focus:border-none sm:max-w-[400px]"
            }
            placeholder="Pesquise por número de apartamento"
            value={filterValue}
            onChange={(e) => setFilterValue(e.target.value)}
          />
        </div>
        <span className="block h-[0.5px] w-full bg-black" />
        <div className="mx-auto flex w-11/12 max-w-[1200px] items-center justify-center pb-8 sm:py-8">
          <DataPaginatedTable<OrderEntity>
            data={filteredData ?? []}
            columns={columns}
          />
        </div>
      </div>

      <div className="flex w-full justify-end">
        <Button
          className=""
          variant="icon"
          size="lg"
          onClick={() => setModalOpen(true)}
        >
          {" "}
          <PlusIcon size={20} /> Registrar encomenda{" "}
        </Button>
      </div>

      <CreateOrderModal isOpen={modalOpen} onOpenChange={setModalOpen} />
    </section>
  );
};

export default OrdersTable;
