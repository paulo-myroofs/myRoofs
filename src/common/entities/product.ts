import { Timestamp } from "./timestamp";

export interface ProductEntity {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  createdAt: Timestamp;
  createdBy: string;
  updatedAt: Timestamp;
  phone: string;
  condominiumId: string;
}
