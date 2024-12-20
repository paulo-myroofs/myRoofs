import { Status } from "@/common/entities/occurrences";
import { Timestamp } from "@/common/entities/timestamp";

export interface OccurrenceColumnData {
  id: string;
  userId: string;
  upload?: string;
  date: Timestamp;
  status: Status;
  details: string;
  condoId: string;
  title: string;
}
