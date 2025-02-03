import { useState } from "react";

import { Timestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";

import { inputClassName } from "@/app/contants";
import Button from "@/components/atoms/Button/button";
import TransitionModal from "@/components/atoms/TransitionModal/tempModal";
import InputFieldForDelete from "@/components/molecules/InputField/InputFieldForDelete";
import { successToast, errorToast } from "@/hooks/useAppToast";
import { queryClient } from "@/store/providers/queryClient";
import { updateFirestoreDoc } from "@/store/services";

import { CreateDeleteCondoModalProps } from "./types";

const CreateDeleteCondoModal = ({
  isOpen,
  onOpenChange,
  condoData
}: CreateDeleteCondoModalProps) => {
  const router = useRouter();
  const [inputValue, setInputValue] = useState("");
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
  };

  const handleEndCondo = async () => {
    await updateFirestoreDoc({
      documentPath: `/condominium/${condoData.id}`,
      data: { endedAt: Timestamp.now() }
    });
    queryClient.invalidateQueries(["condominium"]);
    queryClient.invalidateQueries(["condominium", "endedCondominium"]);
    successToast("Condomínio encerrado com sucesso!");
    router.back();
  };

  const handleConfirmClick = () => {
    if (inputValue === condoData.name) {
      handleEndCondo();
    } else {
      errorToast(
        "O nome do condomínio não confere, por favor, tente novamente."
      );
    }
  };

  return (
    <TransitionModal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title="Deseja mesmo encerrar o condomínio?"
      description="Após o encerramento do condomínio, ele ficará disponível no histórico, mas não poderá mais ser utilizado."
      confirmBtn={
        <Button
          variant="icon"
          size="lg"
          className="w-[210px] bg-[#202425]"
          onClick={handleConfirmClick}
        >
          Confirmar
        </Button>
      }
      cancelBtn={
        <Button
          onClick={() => {
            setInputValue("");
            onOpenChange(false);
          }}
          type="button"
          variant="outline-black"
          size="lg"
          className="w-[210px] text-sm"
        >
          Cancelar
        </Button>
      }
    >
      <InputFieldForDelete
        name="condoName"
        label={condoData.name}
        className={inputClassName}
        placeholder="Digite Aqui"
        value={inputValue}
        onChange={handleInputChange}
      />
    </TransitionModal>
  );
};

export default CreateDeleteCondoModal;
