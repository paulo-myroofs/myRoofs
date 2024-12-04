"use client";

import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

import BlockedCompanyCard from "@/components/atoms/BlockedCompanyCard/blockedCompanyCard";
import Button from "@/components/atoms/Button/button";
import CompanyCard from "@/components/atoms/CompanyCard/companyCard";
import LoadingComponent from "@/components/atoms/Loading/loading";
import TitleAtom from "@/components/atoms/TitleAtom/TitleAtom";
import useActiveCompanies from "@/hooks/queries/companies/useActiveCompanies";
import useBlockedCompanies from "@/hooks/queries/companies/useBlockedCompany";

export default function AdminPage() {
  const router = useRouter();

  const {
    data: activeCompanies,
    isLoading: isActiveLoading,
    isError: isActiveError
  } = useActiveCompanies();

  const {
    data: blockedCompanies,
    isLoading: isBlockedLoading,
    isError: isBlockedError
  } = useBlockedCompanies();

  const isLoading = isActiveLoading || isBlockedLoading;
  const isError = isActiveError || isBlockedError;

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

  return (
    <>
      <section className="mx-auto w-11/12 max-w-[1500px] space-y-8">
        <div className="flex items-center justify-between">
          <TitleAtom>
            {" "}
            Empresas <span className="hidden sm:inline">Cadastradas</span>{" "}
          </TitleAtom>
          <Button
            onClick={() => router.push("/admin/nova-empresa")}
            variant="icon"
            size="md"
            className="w-[140px] bg-[#202425] sm:w-[180px]"
          >
            <Plus className="hidden sm:inline" />
            Nova empresa{" "}
          </Button>
        </div>

        <div>
          <h2 className="text-lg font-semibold">Empresas Ativas</h2>
          {activeCompanies && activeCompanies.length > 0 ? (
            <div className="flex flex-wrap gap-x-12 gap-y-6">
              {activeCompanies.map((item) => (
                <CompanyCard
                  key={item.id}
                  title={item.name}
                  image={item.image}
                  href={"/admin/condominios/" + item.id}
                />
              ))}
            </div>
          ) : (
            <p>Sem empresas ativas cadastradas ainda.</p>
          )}
        </div>

        <div>
          <h2 className="text-lg font-semibold">Empresas Bloqueadas</h2>
          {blockedCompanies && blockedCompanies.length > 0 ? (
            <div className="flex flex-wrap gap-x-12 gap-y-6">
              {blockedCompanies.map((item) => (
                <BlockedCompanyCard key={item.id} company={item} />
              ))}
            </div>
          ) : (
            <p>Sem empresas bloqueadas cadastradas ainda.</p>
          )}
        </div>
      </section>
    </>
  );
}
