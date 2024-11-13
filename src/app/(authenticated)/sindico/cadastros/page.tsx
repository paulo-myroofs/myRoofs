"use client";

import { useState } from "react";

import Link from "next/link";

import Button from "@atoms/Button/button";

import EmployeesTable from "./employees/employees";
import ResidentsTable from "./residents/residents";
import AdministratorTable from "./adminstrator/adminstrator";

export default function MoradoresFuncionariosAdministradoresCadastrados() {
  const [activeTab, setActiveTab] = useState<"Moradores" | "Funcionários" | "Administradores">(
    "Moradores"
  );
  const tabs: Array<"Moradores" | "Funcionários" | "Administradores"> = [
    "Moradores",
    "Funcionários",
    "Administradores"
  ];

  return (
    <main className="mx-auto  w-11/12 max-w-[1500px] space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex max-w-[800px] items-center gap-2">
          {tabs.map((tab) => (
            <Button
              key={tab}
              className={`rounded-full ${
                activeTab === tab
                  ? "bg-[#202425] text-white hover:bg-[#202425] hover:text-white"
                  : ""
              }`}
              size="note"
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </Button>
          ))}
        </div>
{/* 
        <Link
          href={"/sindico/cadastros/novo-sindico"}
          className="font-medium tracking-wide hover:underline"
        >
          {" "}
          Adicionar síndico{" "}
        </Link> */}
      </div>

      {activeTab === "Moradores" && <ResidentsTable />}
      {activeTab === "Funcionários" && <EmployeesTable />}
      {activeTab === "Adminstradores" && <AdministratorTable />}
    </main>
  );
}
