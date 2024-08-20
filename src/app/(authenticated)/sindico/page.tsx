"use client";

import DropdownNotes from "@/components/molecules/DropdownNotes/DropdownNotes";

import AssemblyWarnings from "./components/Assembly/AssemblyWarnings";
import CondoWarnings from "./components/Condo/CondoWarnings";
import ResidentsWarnings from "./components/Residents/ResidentsWarnings";

const Home = () => {
  return (
    <section className="mx-auto w-11/12 max-w-[1500px] space-y-8">
      <div className="flex w-full justify-center sm:justify-end">
        <DropdownNotes storageKey="options-home" />
      </div>
      <CondoWarnings />
      <AssemblyWarnings />
      <ResidentsWarnings />
    </section>
  );
};

export default Home;
