"use client";

import { useState } from "react";

import { PlusIcon } from "lucide-react";
import { twMerge } from "tailwind-merge";

import { VisitEntity } from "@/common/entities/visits";
import Button from "@/components/atoms/Button/button";
import { DataPaginatedTable } from "@/components/atoms/DataTablePaginated/DataTablePaginated";
import Input from "@/components/atoms/Input/input";
import useVisitsByCondoId from "@/hooks/queries/visits/useVisitsByCondoId";
import { storageGet } from "@/store/services/storage";

import { columns } from "./columns";
import CreateVisitsModal from "./components/CreateVisitsModal";

const boxStyle = "border border-black rounded-[8px]";

const VisitsTable = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const condoId = storageGet("condoId") as string;
  const [filterValue, setFilterValue] = useState("");
  const { data: visits } = useVisitsByCondoId(condoId as string);

  const filteredData = visits?.filter((item) =>
    item.name.toLocaleLowerCase().includes(filterValue.toLocaleLowerCase())
  );

  return (
    <>
      <section className="space-y-4">
        <div className={twMerge(boxStyle)}>
          <div className="flex flex-col items-center justify-between gap-y-2 px-8 py-4 sm:flex-row">
            <h1 className="text-[18px] font-bold sm:text-[24px]">
              <span className="hidden sm:inline">Histórico de visitantes</span>
              <span className="inline sm:hidden">Visitantes</span>
            </h1>
            <Input
              className={
                "w-full border border-[#DEE2E6] bg-[#F8F9FA] focus:border-[#DEE2E6] sm:max-w-[400px]"
              }
              placeholder="Pesquise pelo nome"
              value={filterValue}
              onChange={(e) => setFilterValue(e.target.value)}
            />
          </div>
          <span className="block h-[0.5px] w-full bg-black" />
          <div className="mx-auto flex w-11/12 max-w-[1200px] items-center justify-center pb-8 sm:py-8">
            <DataPaginatedTable<VisitEntity>
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
            <PlusIcon size={20} /> Registrar Visitante{" "}
          </Button>
        </div>
      </section>
      <CreateVisitsModal isOpen={modalOpen} onOpenChange={setModalOpen} />
    </>
  );
};

export default VisitsTable;
