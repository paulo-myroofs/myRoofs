"use client";
import React, { useState } from "react";

import Button from "@/components/atoms/Button/button";

import BookingsTable from "./components/Bookings/Bookings";
import IncidentsTable from "./components/Incidents/Incidents";
import LostAndFoundTable from "./components/LostAndFound/LostAndFound";
import VisitsTable from "./components/Visits/VisitsTable";
import WarningTable from "./components/Waning/Warnings";
import { ActiveTabs } from "./types";

const Historico = () => {
  const [activeTab, setActiveTab] = useState<ActiveTabs>("Avisos");

  const tabs = [
    "Avisos",
    "Ocorrências",
    "Reservas",
    "Visitantes",
    "Achados e Perdidos"
  ];

  return (
    <section className="mx-auto w-11/12 max-w-[1500px] space-y-8">
      <div className="flex items-center gap-x-2 ">
        {tabs.map((tab) => (
          <Button
            key={tab}
            className={`rounded-full ${
              activeTab === tab
                ? "bg-[#202425] text-white hover:bg-[#202425] hover:text-white"
                : ""
            }`}
            size="note"
            onClick={() => setActiveTab(tab as ActiveTabs)}
          >
            {tab}
          </Button>
        ))}
      </div>
      {activeTab === "Avisos" && <WarningTable />}
      {activeTab === "Ocorrências" && <IncidentsTable />}
      {activeTab === "Reservas" && <BookingsTable />}
      {activeTab === "Visitantes" && <VisitsTable />}
      {activeTab === "Achados e Perdidos" && <LostAndFoundTable />}
    </section>
  );
};

export default Historico;
