import { TicketEntity } from "@/common/entities/common/condo/ticket";
import { TransitionModalProps } from "@/components/atoms/TransitionModal/types";

export interface CreateTicketModalProps
  extends Pick<TransitionModalProps, "isOpen" | "onOpenChange"> {
  ticketData?: TicketEntity;
  condoId: string;
}
