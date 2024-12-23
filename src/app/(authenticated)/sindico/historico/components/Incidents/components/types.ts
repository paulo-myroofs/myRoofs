import { OccurrenceColumnData } from "../types";

export interface SeeDetailsOccurrenceProps {
  isOpen: boolean;
  onOpenChange: () => void;
  occurenceData: OccurrenceColumnData;
}
