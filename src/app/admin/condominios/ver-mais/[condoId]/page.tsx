"use client";
import { useState } from "react";

import { File, User2, Users2 } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";

import Button from "@/components/atoms/Button/button";
import LoadingComponent from "@/components/atoms/Loading/loading";
import TitleAtom from "@/components/atoms/TitleAtom/TitleAtom";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import useCondo from "@/hooks/queries/condos/useCondo";

import AdminHistory from "./components/AdminHistory/AdminHistory";
import AptManagerData from "./components/AptManagerData/AptManagerData";
import CondoData from "./components/CondoData/CondoData";
import CreateDeleteCondoModal from "./components/CreateDeleteCondoModal/CreateDeleteCondoModal";
import UsersSection from "./components/UsersSection/UsersSection";

const MoreInfoCondo = () => {
  const { condoId } = useParams();
  const [modalOpen, setModalOpen] = useState(false);
  const { data: condo, isLoading, isError } = useCondo(condoId as string);
  const router = useRouter();

  const data = [
    {
      trigger: (
        <div className="font-regular flex items-center gap-4 py-2 text-base md:text-[21px]">
          <User2 strokeWidth={2} />
          <span>Usuários</span>
        </div>
      ),
      content: <UsersSection />
    },
    {
      trigger: (
        <div className="font-regular flex items-center gap-4 py-2 text-base md:text-[21px]">
          <File strokeWidth={2} />
          <span>Dados do condomínio</span>
        </div>
      ),
      content: <CondoData condoId={condoId as string} />
    },
    {
      trigger: (
        <div className="font-regular flex items-center gap-4 py-2 text-base md:text-[21px]">
          <Users2 strokeWidth={2} />
          <span>Dados do responsável legal</span>
        </div>
      ),
      content: (
        <AptManagerData aptManagerId={condo?.aptManagersIds[0] as string} />
      )
    },
    {
      trigger: (
        <div className="font-regular flex items-center gap-4 py-2 text-base md:text-[21px]">
          <Users2 strokeWidth={2} />
          <span>Histórico de administradores</span>
        </div>
      ),
      content: <AdminHistory condoId={condoId as string} />
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
    <>
      <section className="mx-auto w-11/12 max-w-[1500px] space-y-8">
        <div className="flex flex-col justify-between gap-y-4 sm:flex-row sm:items-center">
          <div className="flex items-center">
            <Image
              src="/arrow_back.svg"
              alt="Voltar"
              width={24}
              height={24}
              onClick={() => router.back()}
              className="mr-2 cursor-pointer"
            />
            <TitleAtom> {condo?.name}</TitleAtom>
          </div>
          <Button onClick={() => setModalOpen(true)}>
            {" "}
            Encerrar Condomínio
          </Button>
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
      <CreateDeleteCondoModal
        isOpen={modalOpen}
        onOpenChange={setModalOpen}
        condoData={condo}
      ></CreateDeleteCondoModal>
    </>
  );
};

export default MoreInfoCondo;
