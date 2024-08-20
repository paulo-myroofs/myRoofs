import React, { useState } from "react";

import { CondoNoticeEntity } from "@/common/entities/notices/condoNotices";
import { successToast } from "@/hooks/useAppToast";
import { queryClient } from "@/store/providers/queryClient";
import { deleteFirestoreDoc } from "@/store/services";
import { storageGet } from "@/store/services/storage";

import WarningCard from "../../../WarningCard/WarningCard";
import CreateCondoWarningModal from "../CreateCondoWarningModal/CreateCondoWarningModal";

const CondoWarningCard = ({
  condoNotice
}: {
  condoNotice: CondoNoticeEntity;
}) => {
  const condoId = storageGet<string>("condoId");
  const [modalOpen, setModalOpen] = useState(false);

  const onEdit = () => {
    setModalOpen(true);
  };

  const onRemove = async () => {
    await deleteFirestoreDoc({
      documentPath: `/condoNotices/${condoNotice.id}`
    });
    queryClient.invalidateQueries(["condoNotices", condoId]);
    successToast("Aviso removido com sucesso!");
  };

  return (
    <>
      <WarningCard
        image={condoNotice.image}
        about={condoNotice.about}
        text={condoNotice.text}
        updatedAt={condoNotice.updatedAt}
        onEdit={onEdit}
        onRemove={onRemove}
      />
      <CreateCondoWarningModal
        isOpen={modalOpen}
        onOpenChange={setModalOpen}
        noticeData={condoNotice}
      />
    </>
  );
};

export default CondoWarningCard;
