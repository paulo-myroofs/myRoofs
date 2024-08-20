import { twMerge } from "tailwind-merge";
import "./styles.css";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";

import "../../../app/globals.css";
import { TransitionModalProps } from "./types";

export default function TransitionModal({
  title,
  description,
  children,
  isOpen,
  onOpenChange,
  confirmBtn,
  cancelBtn,
  footerClassName,
  dialogContentClassName,
  headerClassName,
  childrenClassName
}: TransitionModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        className={twMerge(
          "z-50 max-h-[96vh] overflow-y-auto bg-white",
          dialogContentClassName
        )}
      >
        {(title || description) && (
          <DialogHeader className={headerClassName}>
            {title && <DialogTitle>{title}</DialogTitle>}
            {description && (
              <DialogDescription>{description}</DialogDescription>
            )}
          </DialogHeader>
        )}
        <div className={twMerge("px-8", childrenClassName)}>{children}</div>
        <DialogFooter className={footerClassName}>
          {cancelBtn && cancelBtn}
          {confirmBtn && confirmBtn}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
