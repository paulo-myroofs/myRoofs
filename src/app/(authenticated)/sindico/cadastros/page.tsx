"use client";

import { useState } from "react";

import Button from "@atoms/Button/button";

import EmployeesTable from "./employees/employees";
import ResidentsTable from "./residents/residents";

export default function MoradoresFuncionariosCadastrados() {
  const [activeTab, setActiveTab] = useState<"Moradores" | "Funcionários">(
    "Moradores"
  );
  const tabs: Array<"Moradores" | "Funcionários"> = [
    "Moradores",
    "Funcionários"
  ];

  return (
    <main className="mx-auto  w-11/12 max-w-[1500px] space-y-8">
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

      {activeTab === "Moradores" && <ResidentsTable />}
      {activeTab === "Funcionários" && <EmployeesTable />}
    </main>
  );
}
