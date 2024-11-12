import { CondoEntity } from "@/common/entities/common/condo/condo";
import { TransitionModalProps } from "@/components/atoms/TransitionModal/types";

export interface CreateDeleteCondoModalProps
  extends Pick<TransitionModalProps, "isOpen" | "onOpenChange"> {
  condoData: CondoEntity;
}
