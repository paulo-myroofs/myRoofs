import { Timestamp } from "firebase/firestore";
import { AddressFields } from "./adressFields";
import { MaritalStatusOptionsType } from "./common/maritalStatusOptionsType";

export enum Status {
  ACTIVE = "ativo",
  INACTIVE = "inativo",
  UNDEFINED = "indefinido",
}

export interface AptManagerEntity extends AddressFields {
  id: string;
  image: string | null;
  role: "aptManager";
  isSecondary?: boolean;
  companyId: string;
  name: string;
  email: string;
  cpf: string;
  rg: string;
  emitter: string;
  profession: string;
  adminRole: string;
  maritalStatus: MaritalStatusOptionsType;
  status: Status;
  createdAt: Timestamp;
  blockedAt: Timestamp | null;  
}