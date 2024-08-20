import { InputHTMLAttributes } from "react";

export interface CommentInputProps
  extends InputHTMLAttributes<HTMLInputElement> {
  onSend: () => void;
}
