import { Timestamp } from "./timestamp";
export interface AdministratorEntity {
  id: string;
  image: string | null;
  name: string;
  email: string;
  phone?: string;
  cpf: string;
  occupation: string;
  address: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  condominiumCode: string;
  role: "administrator";
}