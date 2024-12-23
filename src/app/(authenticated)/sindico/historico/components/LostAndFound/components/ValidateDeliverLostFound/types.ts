import { LostFound } from "@/common/entities/lostAndFound";
import { TransitionModalProps } from "@/components/atoms/TransitionModal/types";

export interface ValidateDeliverLostFoundProps
  extends Pick<TransitionModalProps, "isOpen" | "onOpenChange"> {
  lostFoundData: LostFound;
}
