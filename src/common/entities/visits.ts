import { Timestamp } from "./timestamp";

export interface VisitEntity {
  id: string;
  name: string;
  phone: string;
  visitType: string; //  "Visita" | "Serviços"
  date: Timestamp;
  createdAt: Timestamp;
  formation: string;
  apartment: string;
  createdBy: string;
  residentId?: string | null; // se nao existe id do morador é o createdBy
  validationCode: string | null;
  wasValidated: boolean;
  condominiumId: string;
}
