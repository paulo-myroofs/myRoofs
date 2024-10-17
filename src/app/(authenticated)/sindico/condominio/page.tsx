"use client";

import { Activity, File, Folder, User2 } from "lucide-react";

import LoadingComponent from "@/components/atoms/Loading/loading";
import TitleAtom from "@/components/atoms/TitleAtom/TitleAtom";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import useCondo from "@/hooks/queries/condos/useCondo";
import useAuth from "@/hooks/useAuth";
import { storageGet } from "@/store/services/storage";

import ActivitiesSection from "./components/ActivitiesSection/ActivitiesSection";
import AptManagerSection from "./components/AptManagerSection/AptManagerSection";
import DocsCondoSection from "./components/DocCondoSection/DocCondoSection";
import InfoCondoSection from "./components/InfoCondoSection/InfoCondoSection";

const Condo = () => {
  const { userUid } = useAuth();
  const condoId = storageGet<string>("condoId");
  const { data: condo, isLoading, isError } = useCondo(condoId as string);
  const data = [
    {
      trigger: (
        <div className="flex items-center gap-4 py-2 text-base font-regular md:text-[21px]">
          <User2 strokeWidth={2} />
          <span>Meu Perfil</span>
        </div>
      ),
      content: <AptManagerSection aptManagerId={userUid} />
    },
    {
      trigger: (
        <div className="flex items-center gap-4 py-2 text-base font-regular md:text-[21px]">
          <File strokeWidth={2} />
          <span>Informações do condomínio</span>
        </div>
      ),
      content: <InfoCondoSection />
    },
    {
      trigger: (
        <div className="flex items-center gap-4 py-2 text-base font-regular md:text-[21px]">
          <Folder strokeWidth={2} />
          <span>Documentação do condomínio</span>
        </div>
      ),
      content: <DocsCondoSection />
    },
    {
      trigger: (
        <div className="flex items-center gap-4 py-2 text-base font-regular md:text-[21px]">
          <Activity strokeWidth={2} />
          <span>Atividades do condomínio</span>
        </div>
      ),
      content: <ActivitiesSection />
    }
  ];

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <LoadingComponent className="w-full" />
      </div>
    );
  }

  if (isError) {
    return <p className="text-center"> Algo deu errado...</p>;
  }
  if (!condo) return;

  return (
    <section className="mx-auto w-11/12 max-w-[1500px] space-y-8">
      <div className="flex justify-between max-sm:max-w-[275px] max-sm:flex-col max-sm:gap-[19px]">
        <TitleAtom> {condo.name} </TitleAtom>
        <div className="código font-inter flex gap-2 rounded-2xl border border-[#000] px-6 py-2">
          <h1 className="flex items-center">Código do Condomíno:</h1>
          <h2 className="flex items-center">{condoId?.substring(0, 6)}</h2>
        </div>
      </div>

      <Accordion type="single" collapsible className="w-full">
        {data.map((item, index) => (
          <AccordionItem value={`item-${index}`} key={`item-${index}`}>
            <AccordionTrigger>{item.trigger}</AccordionTrigger>
            <AccordionContent>{item.content}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
};

export default Condo;
