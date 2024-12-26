import { OrderEntity } from "@/common/entities/order";
import { TransitionModalProps } from "@/components/atoms/TransitionModal/types";

export interface CreateOrderModalProps
  extends Pick<TransitionModalProps, "isOpen" | "onOpenChange"> {
  orderData?: OrderEntity;
}
