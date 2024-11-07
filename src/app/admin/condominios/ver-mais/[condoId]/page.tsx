"use client";
import React from "react";

import { Timestamp } from "firebase/firestore";
import { File, User2, Users2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
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
import { successToast } from "@/hooks/useAppToast";
import { queryClient } from "@/store/providers/queryClient";
import { updateFirestoreDoc } from "@/store/services";

import AptManagerData from "./components/AptManagerData/AptManagerData";
import AdminHistory from "./components/AdminHistory/AdminHistory";
import CondoData from "./components/CondoData/CondoData";
import UsersSection from "./components/UsersSection/UsersSection";

const MoreInfoCondo = () => {
  const router = useRouter();
  const { condoId } = useParams();
  const { data: condo, isLoading, isError } = useCondo(condoId as string);

  const handleEndCondo = async () => {
    await updateFirestoreDoc({
      documentPath: `/condominium/${condoId}`,
      data: { endedAt: Timestamp.now() }
    });
    queryClient.invalidateQueries(["condominium"]);
    queryClient.invalidateQueries(["condominium", "endedCondominium"]);
    successToast("Condomínio encerrado com sucesso!");
    router.push("/admin/historico");
  };

  const data = [
    {
      trigger: (
        <div className="flex items-center gap-4 py-2 text-base font-regular md:text-[21px]">
          <User2 strokeWidth={2} />
          <span>Usuários</span>
        </div>
      ),
      content: <UsersSection />
    },
    {
      trigger: (
        <div className="flex items-center gap-4 py-2 text-base font-regular md:text-[21px]">
          <File strokeWidth={2} />
          <span>Dados do condomínio</span>
        </div>
      ),
      content: <CondoData condoId={condoId as string} />
    },
    {
      trigger: (
        <div className="flex items-center gap-4 py-2 text-base font-regular md:text-[21px]">
          <Users2 strokeWidth={2}/>
          <span>Dados do responsável legal</span>
        </div>
      ),
      content: (
        <AptManagerData aptManagerId={condo?.aptManagersIds[0] as string}/>
      )
    },
    {
      trigger: (
        <div className="flex items-center gap-4 py-2 text-base font-regular md:text-[21px]">
          <Users2 strokeWidth={2}/>
          <span>Histórico de administradores</span>
        </div>
      ),
      content: (
        <AdminHistory condoId={condoId as string} />
      )
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
      <div className="flex flex-col justify-between gap-y-4 sm:flex-row sm:items-center">
        <div className="flex items-center">
          <Image
            src="/arrow_back.svg"
            alt="Voltar"
            width={24}
            height={24}
            onClick={() => router.back()}
            className="cursor-pointer mr-2"
          />
          <TitleAtom> {condo?.name}</TitleAtom>
        </div>
        <Button onClick={handleEndCondo}>Encerrar Condomínio</Button>
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

export default MoreInfoCondo;
