/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";

import { PlusIcon } from "lucide-react";
import { twMerge } from "tailwind-merge";

import { LostFound } from "@/common/entities/lostAndFound";
import Button from "@/components/atoms/Button/button";
import { DataPaginatedTable } from "@/components/atoms/DataTablePaginated/DataTablePaginated";
import Input from "@/components/atoms/Input/input";
import useLostFoundByCondoId from "@/hooks/queries/lostFound/useLostFoundByCondoId";
import { storageGet } from "@/store/services/storage";

import finalColumns from "./components/columns";
import CreateLostFoundModal from "./components/CreateLostFoundModal/CreateLostFoundModal";

const boxStyle = "border border-black rounded-[8px]";

const AchadosPerdidos = () => {
  const [modalOpen, setModalOpen] = useState(false);

  const condoId = storageGet("condoId") as string;
  const [filterValue, setFilterValue] = useState("");
  const { data: lostFoundData } = useLostFoundByCondoId(condoId);
  const filteredData = lostFoundData?.filter((item) =>
    item.description
      .toLocaleLowerCase()
      .includes(filterValue.toLocaleLowerCase())
  );

  return (
    <section className="mx-auto w-11/12 max-w-[1500px] space-y-4">
      <div className="space-y-4">
        <div className={twMerge(boxStyle)}>
          <div className="flex flex-col items-center justify-between gap-y-2 px-8 py-4 sm:flex-row">
            <h1 className="text-[18px] font-bold sm:text-[24px]">
              Achados e Perdidos
            </h1>

            <Input
              className={
                "w-full border border-[#DEE2E6] bg-[#F8F9FA] focus:border-[#DEE2E6] sm:max-w-[400px]"
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
