import { Timestamp } from "../../timestamp";

export interface TicketEntity {
  id: string;
  condominiumId: string;
  category: string;
  name: string;
  apartment: string;
  date: Timestamp;
  status: "pending" | "confirmed";
  formationName: string;
  residentId: string;
  fileUrl: string;
}
