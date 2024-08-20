"use client";
import React, { useState } from "react";

import { AptManagerEntity } from "@/common/entities/aptManager";
import Button from "@/components/atoms/Button/button";
import AddEditCondoForm from "@/components/organism/AddEditCondoForm/AddEditCondoForm";
import useCondo from "@/hooks/queries/condos/useCondo";
import useProfile from "@/hooks/queries/useProfile";
import useAuth from "@/hooks/useAuth";
import { storageGet } from "@/store/services/storage";

const InfoCondoSection = () => {
  const condoId = storageGet<string>("condoId");
  const { userUid } = useAuth();
  const { data: aptManager } = useProfile<AptManagerEntity>(userUid);
  const { data: condo } = useCondo(condoId as string);
  const [isEdit, setIsEdit] = useState(false);

  return (
    <section className="mx-auto w-full max-w-[1300px] space-y-8 ">
      <AddEditCondoForm
        companyId={aptManager?.companyId as string}
        aptManagerId={userUid}
        condoData={condo}
        readOnly={!isEdit}
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
    </section>
  );
};

export default InfoCondoSection;
