export interface TicketColumnData {
  id: string;
  year: string;
  month: string;
  formation: string;
  apartment: string;
  category: string;
  status: "pending" | "confirmed";
  file: string;
  condoId: string;
}
