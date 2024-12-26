import { Timestamp } from "../../timestamp";

export type PeriodsType = "night" | "afternoon" | "morning";

export interface CondoCommonArea {
  name: string;
  capacity: number;
  type:
    | "pool"
    | "grill"
    | "gym"
    | "partyRoom"
    | "block"
    | "cake"
    | "cinema"
    | "gameRoom"
    | "gourmetSpace"
    | "meetingRoom"
    | "petSpace"
    | "playground"
    | "studyRoom"
    | "toyLibrary";
  unavailableDates: { date: Timestamp; periods: PeriodsType[] }[] | null;
}
