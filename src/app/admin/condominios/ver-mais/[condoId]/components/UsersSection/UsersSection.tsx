import React, { useState } from "react";

import Button from "@/components/atoms/Button/button";

import EmployeeSection from "./components/EmployeeSection/section";
import ResidentsSection from "./components/ResidentsSection/section";

const UsersSection = () => {
  const tabs = ["Moradores", "Funcionários"];
  const [activeTab, setActiveTab] = useState<"Moradores" | "Funcionários">(
    "Moradores"
  );

  return (
    <section className="mx-auto space-y-8 px-2 py-4">
      <div className="flex w-[800px] items-center gap-2">
        {tabs.map((item) => (
          <Button
            key={item}
            variant={"outline-black"}
            className={`${
              activeTab === item
                ? "bg-[#202425] text-white hover:bg-[#202425] hover:text-white"
                : ""
            }`}
            size="note"
            onClick={() => setActiveTab(item as "Moradores" | "Funcionários")}
          >
            {item}
          </Button>
        ))}
      </div>
      {activeTab === "Moradores" && <ResidentsSection />}
      {activeTab === "Funcionários" && <EmployeeSection />}
    </section>
  );
};

export default UsersSection;
