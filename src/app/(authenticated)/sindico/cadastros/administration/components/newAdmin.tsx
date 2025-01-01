"use client";

import { useState } from "react";

import { PlusIcon } from "lucide-react";
import { twMerge } from "tailwind-merge";

import { AptManagerEntity } from "@/common/entities/aptManager";
import Button from "@/components/atoms/Button/button";
import { DataPaginatedTable } from "@/components/atoms/DataTablePaginated/DataTablePaginated";
import Input from "@/components/atoms/Input/input";
import useAdministratorsByCondoId from "@/hooks/queries/administrator/useAdministratorByCondoId";
import { storageGet } from "@/store/services/storage";

import CreateAdminModal from "./createAdmin";
import { columns } from "./newAdminColumns";

const boxStyle = "border border-black rounded-[8px]";

const AptManagersTable = () => {
  const condoId = storageGet<string>("condoId") as string;
  const [modalOpen, setModalOpen] = useState(false);
  const [filterValue, setFilterValue] = useState("");

  const { data: aptManagers } = useAdministratorsByCondoId(condoId);

  const filteredData = aptManagers?.filter((item) =>
    item.name.toLowerCase().includes(filterValue.toLowerCase())
  );

  if (!condoId) return null;

  return (
    <section className="space-y-4">
      <div className={twMerge(boxStyle)}>
        <div className="flex flex-col items-center justify-between gap-y-3 px-8 py-4 md:flex-row">
          <h1 className="text-[18px] font-bold sm:text-[24px]">
            Administradores
          </h1>
          <Input
            className="max-w-[300px] border border-[#DEE2E6] bg-[#F8F9FA] focus:border-[#DEE2E6]"
            placeholder="Pesquise pelo nome"
            value={filterValue}
            onChange={(e) => setFilterValue(e.target.value)}
          />
        </div>
        <span className="block h-[0.5px] w-full bg-black" />
        <div className="mx-auto flex w-11/12 max-w-[1200px] items-center justify-center pb-8 sm:py-8">
          <DataPaginatedTable<AptManagerEntity>
            data={filteredData ?? []}
            columns={columns}
          />
        </div>
      </div>
      <div className="flex w-full justify-end">
        <Button variant="icon" size="lg" onClick={() => setModalOpen(true)}>
          <PlusIcon size={20} /> Registrar Administrador
        </Button>
      </div>
      <CreateAdminModal isOpen={modalOpen} onOpenChange={setModalOpen} />
    </section>
  );
};

export default AptManagersTable;
