/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";

import { PlusIcon } from "lucide-react";
import { twMerge } from "tailwind-merge";

import { EmployeeEntity } from "@/common/entities/employee";
import { LostFound } from "@/common/entities/lostAndFound";
import Button from "@/components/atoms/Button/button";
import { DataPaginatedTable } from "@/components/atoms/DataTablePaginated/DataTablePaginated";
import Input from "@/components/atoms/Input/input";
import useLostFoundByCondoId from "@/hooks/queries/lostFound/useLostFoundByCondoId";
import useProfile from "@/hooks/queries/useProfile";
import useAuth from "@/hooks/useAuth";

import finalColumns from "./components/columns";
import CreateLostFoundModal from "./components/CreateLostFoundModal/CreateLostFoundModal";

const boxStyle = "border border-black rounded-[8px]";

const AchadosPerdidos = () => {
  const [modalOpen, setModalOpen] = useState(false);

  const { userUid } = useAuth();
  const { data: user } = useProfile<EmployeeEntity>(userUid);
  const [filterValue, setFilterValue] = useState("");
  const { data: lostFoundData } = useLostFoundByCondoId(
    user?.condominiumCode as string
  );
  const filteredData = lostFoundData?.filter((item) =>
    item.description
      .toLocaleLowerCase()
      .includes(filterValue.toLocaleLowerCase())
  );

  return (
    <section className="mx-auto w-11/12 max-w-[1500px] space-y-4">
      <div className="space-y-4">
        <div className={twMerge(boxStyle)}>
          <div className="flex items-center justify-between px-8 py-4">
            <h1 className="text-[18px] font-bold sm:text-[24px]">
              Achados e Perdidos
            </h1>

            <Input
              className={
                "max-w-[300px] border border-[#DEE2E6] bg-[#F8F9FA] focus:border-none"
              }
              placeholder="Pesquise pela descrição"
              value={filterValue}
              onChange={(e) => setFilterValue(e.target.value)}
            />
          </div>
          <span className="block h-[0.5px] w-full bg-black" />
          <div className="mx-auto flex w-11/12 max-w-[1200px] items-center justify-center pb-8 sm:py-8">
            <DataPaginatedTable<LostFound>
              data={filteredData ?? []}
              columns={finalColumns}
            />
          </div>
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
          <PlusIcon size={20} /> Registrar Objeto{" "}
        </Button>
      </div>

      <CreateLostFoundModal isOpen={modalOpen} onOpenChange={setModalOpen} />
    </section>
  );
};

export default AchadosPerdidos;
