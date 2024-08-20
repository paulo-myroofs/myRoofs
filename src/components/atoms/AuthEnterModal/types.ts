import { Dispatch, SetStateAction } from "react";

import { TransitionModalProps } from "../TransitionModal/types";

export interface AuthEnterModalProps
  extends Pick<TransitionModalProps, "isOpen" | "onOpenChange"> {
  onConfirm?: () => void;
  onCancel?: () => void;
  inputValue: string;
  setInputValue: Dispatch<SetStateAction<string>>;
}
