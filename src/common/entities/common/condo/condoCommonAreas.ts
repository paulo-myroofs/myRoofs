import { Timestamp } from "../../timestamp";

export type PeriodsType = "night" | "afternoon" | "morning";
export interface CondoCommonArea {
  name: string;
  capacity: number;
  type: "pool" | "grill" | "gym" | "partyRoom";
  unavailableDates: { date: Timestamp; periods: PeriodsType[] }[] | null;
}
