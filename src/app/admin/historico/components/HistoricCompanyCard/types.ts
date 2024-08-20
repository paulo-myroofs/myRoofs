import { Timestamp } from "@/common/entities/timestamp";

export interface HistoricCompanyCardProps {
  title: string;
  image: string;
  createdAt: Timestamp;
  endedAt: Timestamp;
}
