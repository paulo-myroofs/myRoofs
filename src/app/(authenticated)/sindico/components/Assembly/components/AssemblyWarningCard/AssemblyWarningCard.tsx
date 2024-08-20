import React, { useState } from "react";

import { CondoAssembly } from "@/common/entities/notices/condoAssemblies";
import { successToast } from "@/hooks/useAppToast";
import { queryClient } from "@/store/providers/queryClient";
import { deleteFirestoreDoc } from "@/store/services";
import { storageGet } from "@/store/services/storage";

import WarningCard from "../../../WarningCard/WarningCard";
import CreateAssemblyModal from "../CreateAssemblyWarningModal/CreateAssemblyWarnigModal";

const AssemblyWarningCard = ({
  condoAssembly
}: {
  condoAssembly: CondoAssembly;
}) => {
  const condoId = storageGet<string>("condoId");
  const [modalOpen, setModalOpen] = useState(false);

  const onEdit = () => {
    setModalOpen(true);
  };

  const onRemove = async () => {
    await deleteFirestoreDoc({
      documentPath: `/condoAssemblies/${condoAssembly.id}`
    });
    queryClient.invalidateQueries(["condoAssemblies", condoId]);
    successToast("Assembleia removida com sucesso!");
  };

  return (
    <>
      <WarningCard
        image={condoAssembly.image}
        about={condoAssembly.about}
        text={condoAssembly.text}
        updatedAt={condoAssembly.updatedAt}
        fileUrl={condoAssembly.meetingFileUrl}
        onEdit={onEdit}
        onRemove={onRemove}
      />
      <CreateAssemblyModal
        isOpen={modalOpen}
        onOpenChange={setModalOpen}
        assemblyData={condoAssembly}
      />
    </>
  );
};

export default AssemblyWarningCard;
