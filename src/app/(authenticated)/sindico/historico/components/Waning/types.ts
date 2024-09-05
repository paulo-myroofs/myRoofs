import { CondoAssembly } from "@/common/entities/notices/condoAssemblies";
import { CondoNoticeEntity } from "@/common/entities/notices/condoNotices";
import { NoticeEntity } from "@/common/entities/notices/notices";

export type WarningColumnData =
  | (CondoNoticeEntity & { type: "condoWarning" })
  | (NoticeEntity & { type: "residentWarning" })
  | (CondoAssembly & { type: "condoAssembly" });
