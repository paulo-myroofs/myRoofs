"use client";

import { useState } from "react";

import Image from "next/image";
import { useParams, useRouter } from "next/navigation";

import Button from "@/components/atoms/Button/button";
import CompanyCard from "@/components/atoms/CompanyCard/companyCard";
import LoadingComponent from "@/components/atoms/Loading/loading";
import TitleAtom from "@/components/atoms/TitleAtom/TitleAtom";
import useCompany from "@/hooks/queries/companies/useCompany";
import useCondosByCompanyId from "@/hooks/queries/condos/useCondosByCompanyId";

import CreateBlockCompanyModal from "./components/CreateBlockCompanyModal/CreateBlockCompanyModal";
import CreateDeleteCompanyModal from "./components/CreateDeleteCompanyModal/CreateDeleteCompanyModal";
import CreateUnlockCompanyModal from "./components/CreateUnlockCompnayModal/CreateUnlockCompanyModal";

export default function CompanyCondos() {
  const router = useRouter();
  const { companyId } = useParams();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [blockModalOpen, setBlockModalOpen] = useState(false);
  const [unlockModalOpen, setUnlockModalOpen] = useState(false);
  const {
    data: condos,
    isLoading,
    isError
  } = useCondosByCompanyId(companyId as string);
  const { data: company } = useCompany(companyId as string);

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

  if (!company) return;

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
            <TitleAtom> Condomínios Cadastrados de {company?.name}</TitleAtom>
          </div>
          <div className="flex justify-around gap-3 sm:justify-start">
            {company.blockedAt === null && (
              <Button onClick={() => setBlockModalOpen(true)}>
                <Image
                  src="/lock-svgrepo-com.svg"
                  alt="Cadeado"
                  width={25}
                  height={25}
                />
              </Button>
            )}
            {company.blockedAt !== null && (
              <Button onClick={() => setUnlockModalOpen(true)}>
                <Image
                  src="/unlock-svgrepo-com.svg"
                  alt="Cadeado"
                  width={25}
                  height={25}
                />
              </Button>
            )}
            <Button
              onClick={() => {
                router.push(`/admin/nova-empresa?companyId=${company.id}`);
              }}
            >
              Editar Empresa
            </Button>
            <Button onClick={() => setDeleteModalOpen(true)}>
              {" "}
              Encerrar Empresa
            </Button>
          </div>
        </div>

        {condos && condos.length > 0 ? (
          <div className="flex flex-wrap gap-x-12 gap-y-6">
            {condos?.map((item) => (
              <CompanyCard
                key={item.id}
                title={item.name}
                image={item.image}
                href={"/admin/condominios/ver-mais/" + item.id}
              />
            ))}
          </div>
        ) : (
          <p> Sem resultados condomínios cadastradas ainda.</p>
        )}
      </section>
      <CreateDeleteCompanyModal
        isOpen={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        companyData={company}
        condoData={condos}
      ></CreateDeleteCompanyModal>
      <CreateBlockCompanyModal
        isOpen={blockModalOpen}
        onOpenChange={setBlockModalOpen}
        companyData={company}
        condoData={condos}
      ></CreateBlockCompanyModal>
      <CreateUnlockCompanyModal
        isOpen={unlockModalOpen}
        onOpenChange={setUnlockModalOpen}
        companyData={company}
        condoData={condos}
      ></CreateUnlockCompanyModal>
    </>
  );
}
