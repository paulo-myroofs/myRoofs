import { Timestamp } from "firebase/firestore";

import { CondoActivityEntity } from "./condoActivity";
import { CondoCommonArea } from "./condoCommonAreas";

export interface CondoEntity {
  id: string;
  aptManagersIds: string[];
  companyId: string;
  name: string;
  image: string;
  cnpj: string;
  addressData: {
    address: string;
    neighborhood: string;
    state: string;
    number: string;
    cep: string;
    city: string;
  };
  phone: string;
  formationType: "Bloco" | "Torre" | "Unidade" | "Quadra" | "Lote" | "Outro";
  formationOther: string | null;
  formationNames: string[];
  housingType:
    | "Apartamento"
    | "Bangalô"
    | "Casa"
    | "Cabana"
    | "Chalé"
    | "Kitnet"
    | "Studio"
    | "Outro";
  housingOther: string | null;
  floorsQty: number;
  aptQty: number;
  garageQty: number;
  commonAreas: CondoCommonArea[] | null;
  activities: CondoActivityEntity[] | null;
  conventionDoc?: string | null;
  regulationsDoc?: string | null;
  createdAt: Timestamp;
  endedAt: Timestamp | null;
}
