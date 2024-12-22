"use client";

import { useState } from "react";

import { PlusIcon } from "lucide-react";
import { twMerge } from "tailwind-merge";

import { EmployeeEntity } from "@/common/entities/employee";
import Button from "@/components/atoms/Button/button";
import { DataPaginatedTable } from "@/components/atoms/DataTablePaginated/DataTablePaginated";
import Input from "@/components/atoms/Input/input";
import useEmployeesByCondoId from "@/hooks/queries/employee/useEmployeesByCondoId";
import { storageGet } from "@/store/services/storage";

import CreateEmployeeModal from "./components/CreateEmployeeModal/CreateEmployeeModal";
import { columns } from "./employeesColumns";

const boxStyle = "border border-black rounded-[8px]";

const EmployeesTable = () => {
  const condoId = storageGet<string>("condoId");
  // const condoId = "12345";

  const [modalOpen, setModalOpen] = useState(false);
  const [filterValue, setFilterValue] = useState("");
  const { data: employees } = useEmployeesByCondoId(condoId as string);
  const filteredData = employees?.filter((item) =>
    item.name.toLocaleLowerCase().includes(filterValue.toLocaleLowerCase())
  );

  if (!condoId) return;

  return (
    <section className="space-y-4">
      <div className={twMerge(boxStyle)}>
        <div className="flex flex-col items-center justify-between gap-y-3 px-8 py-4 md:flex-row">
          <h1 className="text-[18px] font-bold sm:text-[24px]">Funcionários</h1>

          <Input
            className={
              "max-w-[300px] border border-[#DEE2E6] bg-[#F8F9FA] focus:border-[#DEE2E6]"
            }
            placeholder="Pesquise pelo nome"
            value={filterValue}
            onChange={(e) => setFilterValue(e.target.value)}
          />
        </div>
        <span className="block h-[0.5px] w-full bg-black" />
        <div className="mx-auto flex w-11/12 max-w-[1200px] items-center justify-center pb-8 sm:py-8">
          <DataPaginatedTable<EmployeeEntity>
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
          <PlusIcon size={20} /> Registrar Funcionário{" "}
        </Button>
      </div>
      <CreateEmployeeModal isOpen={modalOpen} onOpenChange={setModalOpen} />
    </section>
  );
};

export default EmployeesTable;
