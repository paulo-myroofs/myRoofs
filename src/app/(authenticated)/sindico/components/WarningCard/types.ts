import { CondoNoticeEntity } from "@/common/entities/notices/condoNotices";

export interface WarningCardProps
  extends Pick<CondoNoticeEntity, "image" | "about" | "text" | "updatedAt"> {
  fileUrl?: string;
  canEdit?: boolean;
  canRemove?: boolean;
  onEdit?: () => void;
  onRemove?: () => void;
}
