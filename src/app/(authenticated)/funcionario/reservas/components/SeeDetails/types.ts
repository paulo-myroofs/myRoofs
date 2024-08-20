import { BookingEntity } from "@/common/entities/booking";
import { TransitionModalProps } from "@/components/atoms/TransitionModal/types";

export interface SeeDetailsProps
  extends Pick<TransitionModalProps, "isOpen" | "onOpenChange"> {
  bookingData?: BookingEntity;
}
