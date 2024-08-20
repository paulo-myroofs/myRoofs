import { Timestamp } from "../timestamp";

export interface CondoNoticeEntity {
  id: string;
  about: string;
  text: string;
  image: string;
  condominiumId: string;
  creatorId: string; // aptManager id
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
