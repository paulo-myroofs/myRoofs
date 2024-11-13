import { AdministratorEntity } from "@/common/entities/administrator";
import { TransitionModalProps } from "@/components/atoms/TransitionModal/types";

export interface AdministratorModalProps
  extends Pick<TransitionModalProps, "isOpen" | "onOpenChange"> {
  administratorData?: AdministratorEntity; // in case of edit
}