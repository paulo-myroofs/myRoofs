import { BrazilStatesOptionsType } from "./common/brazilStatesOptionsType";

export interface AddressFields {
  address: string;
  neighborhood: string;
  state: BrazilStatesOptionsType;
  number: string;
  cep: string;
}
