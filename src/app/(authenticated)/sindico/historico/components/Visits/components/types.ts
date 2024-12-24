import { VisitEntity } from "@/common/entities/visits";
import { TransitionModalProps } from "@/components/atoms/TransitionModal/types";

export interface CreateVisitsModalProps
  extends Pick<TransitionModalProps, "isOpen" | "onOpenChange"> {
  visitData?: VisitEntity; // in case of edit
}
