import { PeriodsType } from "./common/condo/condoCommonAreas";
import { Timestamp } from "./timestamp";

export interface BookingEntity {
  id: string;
  condominiumId: string;
  userId: string; // id do morador
  formation: string;
  apartment: string;
  periods: PeriodsType[];
  date: Timestamp;
  area: string; // nome da área comum
  paymentDoc: string;
  guestsDoc: string;
}
