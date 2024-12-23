import React from "react";

import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot
} from "@/components/ui/input-otp";
import Button from "@atoms/Button/button";

import { AuthEnterModalProps } from "./types";

import TransitionModal from "../TransitionModal/tempModal";

const AuthEnterModal = ({
  isOpen,
  onOpenChange,
  onConfirm,
  onCancel,
  inputValue,
  setInputValue
}: AuthEnterModalProps) => {
  const handleClose = () => {
    setInputValue(""); // Reseta o valor do input
    onOpenChange(false); // Fecha o modal
  };

  return (
    <TransitionModal
      title="Autenticação de Entrada"
      description={"Insira o código individual do morador"}
      isOpen={isOpen}
      onOpenChange={handleClose}
      confirmBtn={
        <Button
          onClick={() => {
            if (onConfirm) {
              onConfirm();
            }
            handleClose();
          }}
          variant="icon"
          size="lg"
          className=" w-[210px] bg-[#202425]"
        >
          Confirmar
        </Button>
      }
      cancelBtn={
        <Button
          onClick={() => {
            if (onCancel) {
              onCancel();
            }
            handleClose();
          }}
          variant="outline-black"
          size="lg"
          className="w-[210px] text-sm"
        >
          Cancelar
        </Button>
      }
    >
      <InputOTP
        maxLength={4}
        value={inputValue}
        onChange={(value) => setInputValue(value)}
        pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
      >
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
          <InputOTPSlot index={3} />
        </InputOTPGroup>
      </InputOTP>
    </TransitionModal>
  );
};

export default AuthEnterModal;
