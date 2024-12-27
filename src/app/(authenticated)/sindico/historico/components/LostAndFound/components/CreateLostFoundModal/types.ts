import { LostFound } from "@/common/entities/lostAndFound";
import { TransitionModalProps } from "@/components/atoms/TransitionModal/types";

export interface CreateLostFoundModalProps
  extends Pick<TransitionModalProps, "isOpen" | "onOpenChange"> {
  lostFoundData?: LostFound;
}
