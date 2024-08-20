import { Timestamp } from "./timestamp";

export interface EmployeeEntity {
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
  role: "employee";
}
