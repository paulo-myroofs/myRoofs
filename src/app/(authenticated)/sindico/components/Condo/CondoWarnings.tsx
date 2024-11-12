"use client";
import { useState } from "react";

import { Notebook } from "lucide-react";

import BorderWrapper from "@/components/atoms/BorderWrapper/BorderWrapper";
import Button from "@/components/atoms/Button/button";
import useCondoNotices from "@/hooks/queries/condos/notices/useCondoNotices";
import { storageGet } from "@/store/services/storage";

import CondoWarningCard from "./components/CondoWarningCard/CondoWarningCard";
import CreateCondoWarningModal from "./components/CreateCondoWarningModal/CreateCondoWarningModal";

const CondoWarnings = () => {
  const condoId = storageGet<string>("condoId") as string;
  const [createWarningOpen, setCreateWarningOpen] = useState(false);
  const { data: condoNotices } = useCondoNotices(condoId);
  if (!condoNotices) return;
  return (
    <>
      <BorderWrapper className="flex flex-col items-center gap-y-8 p-4 sm:p-8">
        <h1 className=" text-[20px] font-semibold sm:text-[24px]">
          Avisos do condomínio
        </h1>

        <div className="w-full space-y-4 sm:w-[80%]">
          {condoNotices
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
              <CondoWarningCard key={item.id} condoNotice={item} />
            ))}
        </div>

        <Button
          className="mx-auto flex items-center gap-4"
          variant="outline-black"
          onClick={() => setCreateWarningOpen(true)}
        >
          <Notebook size={20} />
          Criar aviso
        </Button>
      </BorderWrapper>

      <CreateCondoWarningModal
        isOpen={createWarningOpen}
        onOpenChange={setCreateWarningOpen}
      />
    </>
  );
};

export default CondoWarnings;
