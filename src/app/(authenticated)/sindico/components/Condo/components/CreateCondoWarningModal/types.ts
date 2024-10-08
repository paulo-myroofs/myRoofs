import { CondoNoticeEntity } from "@/common/entities/notices/condoNotices";
import { TransitionModalProps } from "@/components/atoms/TransitionModal/types";

export interface CreateCondoWarningModalProps
  extends Pick<TransitionModalProps, "isOpen" | "onOpenChange"> {
  noticeData?: CondoNoticeEntity; // in case of edit
  readOnly?: boolean;
}
