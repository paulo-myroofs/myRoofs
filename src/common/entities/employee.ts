import { Timestamp } from "./timestamp";

export interface EmployeeAddress {
  cep: string;
  state: string;
  city: string;
  neighborhood: string;
  address: string;
  number: string;
}

export interface EmployeeEntity {
  id: string;
  image: string | null;
  name: string;
  email: string;
  phone?: string;
  cpf: string;
  occupation: string;
  address: EmployeeAddress;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  condominiumCode: string;
  role: "employee";
}
