import { AddressFields } from "./adressFields";
import { MaritalStatusOptionsType } from "./common/maritalStatusOptionsType";

export interface AptManagerEntity extends AddressFields {
  id: string;
  role: "aptManager";
  companyId: string;
  name: string;
  email: string;
  cpf: string;
  rg: string;
  emitter: string;
  profession: string;
  maritalStatus: MaritalStatusOptionsType;
}
