import { useState } from "react";

import { useRouter } from "next/navigation";

import { inputClassName } from "@/app/contants";
import Button from "@/components/atoms/Button/button";
import TransitionModal from "@/components/atoms/TransitionModal/tempModal";
import InputFieldForDelete from "@/components/molecules/InputField/InputFieldForDelete";
import { successToast, errorToast } from "@/hooks/useAppToast";
import { queryClient } from "@/store/providers/queryClient";
import { deleteFirestoreDoc } from "@/store/services";
import { deleteUserAuth } from "@/store/services/auth";

import { DeleteAdminModalProps } from "./types";

const DeleteAdminModal = ({
  isOpen,
  onOpenChange,
  adminData,
  condoId
}: DeleteAdminModalProps) => {
  const router = useRouter();
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
  };

  const handleDeleteAdmin = async () => {
    const { error } = await deleteUserAuth(adminData.id);

    if (error) {
      errorToast("Erro ao remover administrador. Por favor, tente novamente.");
      return;
    }

    await deleteFirestoreDoc({ documentPath: `/users/${adminData.id}` });

    queryClient.invalidateQueries(["aptManager", condoId]);
    successToast("Administrador removido com sucesso.");
    router.push("/admin");
  };

  const handleConfirmClick = () => {
    if (inputValue === adminData.name) {
      handleDeleteAdmin();
    } else {
      errorToast(
        "O nome do administrador não corresponde. Por favor, tente novamente."
      );
    }
  };

  return (
    <TransitionModal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title="Deseja mesmo excluir este administrador?"
      description="Essa ação é irreversível. Confirme digitando o nome do administrador."
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
        name="admin"
        label={adminData.name}
        className={inputClassName}
        placeholder="Digite aqui"
        value={inputValue}
        onChange={handleInputChange}
      />
    </TransitionModal>
  );
};

export default DeleteAdminModal;
