import React from "react";

import LoadingComponent from "@/components/atoms/Loading/loading";
import AddEditCondoForm from "@/components/organism/AddEditCondoForm/AddEditCondoForm";
import useCondo from "@/hooks/queries/condos/useCondo";

const CondoData = ({ condoId }: { condoId: string }) => {
  const { data: condo } = useCondo(condoId);

  if (!condo) {
    return (
      <div className="h-[20vh]">
        <LoadingComponent />
      </div>
    );
  }
  return (
    <div className="mx-auto max-w-[1200px]">
      <AddEditCondoForm
        aptManagerId={condo?.aptManagerId}
        companyId={condo?.companyId}
        readOnly
        condoData={condo}
      />
    </div>
  );
};

export default CondoData;
