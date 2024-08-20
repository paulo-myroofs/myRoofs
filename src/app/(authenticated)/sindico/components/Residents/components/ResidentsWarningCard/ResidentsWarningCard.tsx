import { NoticeEntity } from "@/common/entities/notices/notices";
import { successToast } from "@/hooks/useAppToast";
import { queryClient } from "@/store/providers/queryClient";
import { deleteFirestoreDoc } from "@/store/services";

import WarningCard from "../../../WarningCard/WarningCard";

const ResidentsWarningCard = ({ notice }: { notice: NoticeEntity }) => {
  const onRemove = async () => {
    await deleteFirestoreDoc({
      documentPath: `/notices/${notice.id}`
    });
    queryClient.invalidateQueries(["notices", notice.condominiumId]);
    successToast("Aviso removido com sucesso!");
  };

  return (
    <WarningCard
      image={notice.image}
      about={notice.about}
      text={notice.text}
      updatedAt={notice.updatedAt}
      onRemove={onRemove}
    />
  );
};

export default ResidentsWarningCard;
