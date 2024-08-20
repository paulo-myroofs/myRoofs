import { CondoNoticeEntity } from "@/common/entities/notices/condoNotices";
import { NoticeEntity } from "@/common/entities/notices/notices";

type Aux = CondoNoticeEntity | NoticeEntity;

export type WarningColumnData = Aux & {
  type: "condo" | "resident";
};
