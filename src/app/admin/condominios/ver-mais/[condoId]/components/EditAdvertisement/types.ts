import { TransitionModalProps } from "@/components/atoms/TransitionModal/types";

export interface EditAdvertisementProps
  extends Pick<TransitionModalProps, "isOpen" | "onOpenChange"> {}
