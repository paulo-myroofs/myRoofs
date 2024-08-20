import { InstallmentEntity } from "@/common/entities/common/condo/installment";
import { TransitionModalProps } from "@/components/atoms/TransitionModal/types";

export interface CreateAccountabilityModalProps
  extends Pick<TransitionModalProps, "isOpen" | "onOpenChange"> {
  installmentData?: InstallmentEntity;
  condoId: string;
}
