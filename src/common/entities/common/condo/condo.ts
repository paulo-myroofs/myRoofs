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
  address: string;
  phone: string;
  formationType: "Bloco" | "Torre";
  formationNames: string[];
  housingName: string;
  floorsQty: number;
  garageQty: number;
  commonAreas: CondoCommonArea[] | null;
  activities: CondoActivityEntity[] | null;
  conventionDoc?: string | null;
  regulationsDoc?: string | null;
  createdAt: Timestamp;
  endedAt: Timestamp | null;
}
