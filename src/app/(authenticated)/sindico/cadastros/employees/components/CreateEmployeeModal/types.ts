import { EmployeeEntity } from "@/common/entities/employee";
import { TransitionModalProps } from "@/components/atoms/TransitionModal/types";

export interface EmployeeModalProps
  extends Pick<TransitionModalProps, "isOpen" | "onOpenChange"> {
  employeeData?: EmployeeEntity; // in case of edit
}
