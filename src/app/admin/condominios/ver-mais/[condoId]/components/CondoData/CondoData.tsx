import React, { useState } from "react";

import Button from "@/components/atoms/Button/button";
import LoadingComponent from "@/components/atoms/Loading/loading";
import AddEditCondoForm from "@/components/organism/AddEditCondoForm/AddEditCondoForm";
import useCondo from "@/hooks/queries/condos/useCondo";

const CondoData = ({ condoId }: { condoId: string }) => {
  const { data: condo } = useCondo(condoId);
  const [isEdit, setIsEdit] = useState(false);

  if (!condo) {
    return (
      <div className="h-[20vh]">
        <LoadingComponent />
      </div>
    );
  }
  return (
    <div className="mx-auto max-w-[1200px] space-y-8">
      <AddEditCondoForm
        aptManagersIds={condo?.aptManagersIds}
        companyId={condo?.companyId}
        readOnly={!isEdit}
        condoData={condo}
        setEditFalse={() => setIsEdit(false)}
      />
      {!isEdit && (
        <Button
          variant="basicBlack"
          onClick={() => setIsEdit(true)}
          className="mx-auto"
        >
          {" "}
          Editar{" "}
        </Button>
      )}
    </div>
  );
};

export default CondoData;
