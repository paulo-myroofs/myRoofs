import { ReactNode } from "react";

export interface TransitionModalProps {
  children?: React.ReactNode;
  title?: string;
  description?: string;
  isOpen: boolean;
  onOpenChange: (value: boolean) => void;
  hasButtons?: boolean;
  confirmBtn?: ReactNode;
  cancelBtn?: ReactNode;
  headerClassName?: string;
  dialogContentClassName?: string;
  hideClose?: boolean;
  footerClassName?: string;
  childrenClassName?: string;
}
