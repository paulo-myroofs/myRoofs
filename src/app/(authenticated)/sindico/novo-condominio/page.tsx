"use client";

import { useEffect } from "react";

import { AptManagerEntity } from "@/common/entities/aptManager";
import TitleAtom from "@/components/atoms/TitleAtom/TitleAtom";
import AddEditCondoForm from "@/components/organism/AddEditCondoForm/AddEditCondoForm";
import useProfile from "@/hooks/queries/useProfile";
import useAuth from "@/hooks/useAuth";

const NewCondo = () => {
  const { userUid } = useAuth();
  const { data: aptManager } = useProfile<AptManagerEntity>(userUid);

  // Scroll suave para o topo da página
  useEffect(() => {
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    }, 0);
  }, []);

  return (
    <section className="mx-auto block w-11/12 max-w-[885px] pb-[40px]">
      <TitleAtom className="pb-8 text-center"> Novo Condomínio </TitleAtom>
      <AddEditCondoForm
        companyId={aptManager?.companyId as string}
        aptManagersIds={[userUid]}
      />
    </section>
  );
};

export default NewCondo;
