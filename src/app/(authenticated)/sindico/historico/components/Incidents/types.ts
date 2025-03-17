import { Status } from "@/common/entities/occurrences";
import { Timestamp } from "@/common/entities/timestamp";

export enum Reaction {
  LIKE = "like",
  DISLIKE = "dislike",
  NONE = "none"
}

export interface OccurrenceColumnData {
  id: string;
  userId: string;
  upload?: string;
  date: Timestamp;
  status: Status;
  details: string;
  condoId: string;
  title: string;
  return: string;
  reaction: Reaction;
  formationName: string;
  housingName: string;
  returnDate: Timestamp | null;
}
