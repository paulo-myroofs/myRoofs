import { TransitionModalProps } from "@/components/atoms/TransitionModal/types";

export interface EditPropagandaProps
  extends Pick<TransitionModalProps, "isOpen" | "onOpenChange"> {
  condoId: string;
}
