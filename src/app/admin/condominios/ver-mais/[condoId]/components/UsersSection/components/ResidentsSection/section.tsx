import React from "react";

import { useParams } from "next/navigation";

import { ResidentEntity } from "@/common/entities/resident";
import LoadingComponent from "@/components/atoms/Loading/loading";
import useResidentsByCondoId from "@/hooks/queries/residents/useResidentsByCondoId";

import { columns } from "./columns";
import { ResidentColumnData } from "./types";

import TableSection from "../TableSection/TableSection";

const ResidentsSection = () => {
  const { condoId } = useParams();
  const { data: residentData, isLoading } = useResidentsByCondoId(
    condoId as string,
    (data) =>
      data.map(
        (item: ResidentEntity) =>
          ({
            email: item.email,
            name: item.name,
            formation: item.formationName,
            apartment: item.housingName
          }) as ResidentColumnData
      )
  );

  if (isLoading) {
    return (
      <div className="flex h-[30vh] items-center justify-center">
        <LoadingComponent />
      </div>
    );
  }

  return (
    <TableSection title="Moradores" data={residentData} columns={columns} />
  );
};

export default ResidentsSection;
