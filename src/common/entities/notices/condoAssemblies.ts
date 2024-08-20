import { CondoNoticeEntity } from "./condoNotices";

export interface CondoAssembly extends CondoNoticeEntity {
  meetingFileUrl: string;
}
