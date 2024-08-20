import { Timestamp } from "../timestamp";

export interface NoticeEntity {
  id: string;
  about: string;
  text: string;
  image: string;
  creatorId: string;
  audioPath: string;
  audioUrl?: string;
  creatorName: string;
  condominiumId: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
