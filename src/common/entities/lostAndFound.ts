import { Timestamp } from "./timestamp";

export interface LostFound {
  id: string;
  condominiumId: string;
  date: Timestamp;
  foundLocal: string;
  deliveredTo: string | null; // status will be updated from here
  description: string;
  imageUrl: string;
  foundBy: string;
}
