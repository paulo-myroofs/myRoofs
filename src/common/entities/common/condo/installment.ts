import { Timestamp } from "../../timestamp";

export interface InstallmentEntity {
  id: string;
  condominiumId: string;
  formation: string;
  date: Timestamp;
  fileUrl: string;
}
