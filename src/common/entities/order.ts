import { Timestamp } from "./timestamp";

export interface OrderEntity {
  id: string;
  condominiumId: string;
  employeeId: string;
  deliverTo: string; // morador pra se entregar a encomenda
  date: Timestamp;
  apartment: string;
  formation: string;
  wasDelivered: boolean;
}
