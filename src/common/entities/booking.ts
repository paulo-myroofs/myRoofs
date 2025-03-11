import { PeriodsType } from "./common/condo/condoCommonAreas";
import { Timestamp } from "./timestamp";

export interface BookingEntity {
  id: string;
  condominiumId: string;
  userId: string; // id do morador
  formation: string;
  apartment: string;
  periods: PeriodsType[];
  dates: Timestamp;
  area: string; // nome da área comum
  receiptImage: string;
  guestsDoc: string;
}
