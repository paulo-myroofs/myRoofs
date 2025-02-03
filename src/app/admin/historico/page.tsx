"use client";

import { Timestamp } from "@/common/entities/timestamp";
import LoadingComponent from "@/components/atoms/Loading/loading";
import TitleAtom from "@/components/atoms/TitleAtom/TitleAtom";
import useEndedCompanies from "@/hooks/queries/companies/useEndedCompanies";
import useEndedCondos from "@/hooks/queries/condos/useEndedCondos";

import HistoricCompanyCard from "./components/HistoricCompanyCard/HistoricCompanyCard";
import HistoricCondoCard from "./components/HistoricCondoCard/HistoricCondoCard";

export default function AdminPage() {
  const { data: companies, isLoading, isError } = useEndedCompanies();
  const { data: condos, refetch } = useEndedCondos();
  refetch();
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
    <section className="mx-auto w-11/12 max-w-[1500px] space-y-16">
      <div className="space-y-8">
        <TitleAtom> Histórico de Empresas </TitleAtom>
        {companies && companies.length > 0 ? (
          <div className="flex flex-wrap gap-x-12 gap-y-6">
            {companies?.map((item) => (
              <HistoricCompanyCard
                key={item.id}
                title={item.name}
                image={item.image}
                createdAt={item.createdAt}
                endedAt={item.endedAt as Timestamp}
              />
            ))}
          </div>
        ) : (
          <p> Sem resultados empresas encerradas ainda.</p>
        )}
      </div>

      <div className="space-y-8">
        <TitleAtom> Histórico de Condomínios </TitleAtom>
        {condos && condos.length > 0 ? (
          <div className="flex flex-wrap gap-x-12 gap-y-6">
            {condos?.map((item) => (
              <HistoricCondoCard
                key={item.id}
                title={item.name}
                image={item.image}
                companyId={item.companyId}
                createdAt={item.createdAt}
                endedAt={item.endedAt as Timestamp}
              />
            ))}
          </div>
        ) : (
          <p> Sem resultados condomínios encerradas ainda.</p>
        )}
      </div>
    </section>
  );
}
