import { AddressFields } from "./adressFields";
import { Timestamp } from "./timestamp";

export interface CompanyEntity extends AddressFields {
  id: string;
  image: string;
  aptManagerId: string;
  name: string;
  cnpj: string;
  setupValue: number;
  monthValue: number;
  endedAt: Timestamp | null;
  finder: string | null;
  createdAt: Timestamp;
  blockedAt: Timestamp | null;
}
