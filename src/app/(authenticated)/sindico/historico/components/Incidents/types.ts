import { Timestamp } from "firebase/firestore";

import { Status } from "@/common/entities/occurrences";

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
  responseDate?: Timestamp;
}
