import { AptManagerEntity } from "@/common/entities/aptManager";
import { TransitionModalProps } from "@/components/atoms/TransitionModal/types";

export interface AdminModalProps
  extends Pick<TransitionModalProps, "isOpen" | "onOpenChange"> {
  adminData?: AptManagerEntity;
}
