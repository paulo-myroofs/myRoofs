import { Timestamp } from "./timestamp";

export enum Status {
  CLOSED = "encerrado",
  REFUSED = "recusado",
  WAITING = "aguardando retorno"
}

export interface OccurrenceEntity {
  id: string;
  userId: string;
  condominiumId: string;
  title: string;
  details: string;
  upload?: string;
  date: Timestamp;
  status: Status;
  return: string;
  reaction: "link" | "deslike" | "none";
  response: string;
  formationName: string;
  appartmentNumber: Number;
  responseDate: Timestamp;
}
