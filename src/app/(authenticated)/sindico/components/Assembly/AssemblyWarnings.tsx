"use client";
import { useState } from "react";

import { Users2 } from "lucide-react";

import BorderWrapper from "@/components/atoms/BorderWrapper/BorderWrapper";
import Button from "@/components/atoms/Button/button";
import useCondoAssemblies from "@/hooks/queries/condos/assemblies/useCondoAssemblies";
import { storageGet } from "@/store/services/storage";

import AssemblyWarningCard from "./components/AssemblyWarningCard/AssemblyWarningCard";
import CreateAssemblyModal from "./components/CreateAssemblyWarningModal/CreateAssemblyWarnigModal";

const AssemblyWarnings = () => {
  const condoId = storageGet<string>("condoId") as string;
  const [createWarningOpen, setCreateWarningOpen] = useState(false);
  const { data: condoAssemblies } = useCondoAssemblies(condoId as string);
  if (!condoAssemblies) return;
  return (
    <>
      <BorderWrapper className="flex flex-col items-center gap-y-8 p-4 sm:p-8">
        <h1 className=" text-[20px] font-semibold sm:text-[24px]">
          Assembleias
        </h1>

        <div className="w-full space-y-4 sm:w-[80%]">
          {condoAssemblies
            .sort((a, b) => {
              const dateA = new Date(
                Math.max(a.createdAt.seconds, a.updatedAt.seconds) * 1000
              );
              const dateB = new Date(
                Math.max(b.createdAt.seconds, b.updatedAt.seconds) * 1000
              );
              return dateB.getTime() - dateA.getTime();
            })
            .map((item) => (
              <AssemblyWarningCard key={item.id} condoAssembly={item} />
            ))}
        </div>

        <Button
          className="mx-auto flex  items-center gap-4"
          variant="outline-black"
          size="lg"
          onClick={() => setCreateWarningOpen(true)}
        >
          <Users2 size={20} />
          Criar assembleia
        </Button>
      </BorderWrapper>

      <CreateAssemblyModal
        isOpen={createWarningOpen}
        onOpenChange={setCreateWarningOpen}
      />
    </>
  );
};

export default AssemblyWarnings;
