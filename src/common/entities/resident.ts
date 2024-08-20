import { Timestamp } from "./timestamp";

export interface ResidentEntity {
  id: string;
  name: string;
  email: string;
  phone?: string;
  cpf: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  condominiumCode: string;
  image: string | null;
  formationName: "Torre" | "Bloco";
  housingName: string;
  deliveryCode?: string;
  role: "resident";
  tokens: string[];
}
