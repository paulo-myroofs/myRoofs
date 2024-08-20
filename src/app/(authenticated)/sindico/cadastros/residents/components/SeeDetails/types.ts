import { ResidentEntity } from "@/common/entities/resident";
import { TransitionModalProps } from "@/components/atoms/TransitionModal/types";

export interface SeeDetailsProps
  extends Pick<TransitionModalProps, "isOpen" | "onOpenChange"> {
  residentData?: ResidentEntity;
}
