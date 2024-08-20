import { Timestamp } from "./timestamp";

export interface ServiceEntity {
  id: string;
  name: string;
  description: string;
  image: string;
  createdAt: Timestamp;
  createdBy: string;
  updatedAt: Timestamp;
  phone: string;
  condominiumId: string;
}
