import { Timestamp } from "./timestamp";

export enum OrderType {
  PACKAGE = " Pacote",
  LARGE_PACKAGE = "Pacote Grande",
  MAIL = "Correspondência",
  DELIVERY = "Delivery",
  FRAGILE_ITEM = "Item Frágil",
  OTHER = "Outro"
}

export interface OrderEntity {
  id: string;
  condominiumId: string;
  employeeId: string;
  deliverTo: string; // morador pra se entregar a encomenda
  date: Timestamp;
  apartment: string;
  formation: string;
  wasDelivered: boolean;
  orderType: OrderType; // tipo de encomenda
  deliverBy: string; // quem entregou a encomenda
}
