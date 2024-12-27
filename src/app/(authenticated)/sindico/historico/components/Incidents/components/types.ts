import { TransitionModalProps } from "@/components/atoms/TransitionModal/types";

import { OccurrenceColumnData } from "../types";

export interface SeeDetailsOccurrenceProps
  extends Pick<TransitionModalProps, "isOpen" | "onOpenChange"> {
  occurenceData: OccurrenceColumnData;
}
