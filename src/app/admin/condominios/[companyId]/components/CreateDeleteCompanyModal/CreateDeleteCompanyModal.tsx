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
import { deleteUserAuth } from "@/store/services/auth";

import { CreateDeleteCompanyModalProps } from "./types";

const CreateDeleteCompanyModal = ({
  isOpen,
  onOpenChange,
  companyData,
  condoData
}: CreateDeleteCompanyModalProps) => {
  const router = useRouter();
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
  };

  const handleEndCompany = async () => {
    const { error } = await deleteUserAuth(companyData?.aptManagerId as string);

    if (error) {
      errorToast("Erro ao encerrar a empresa. Por favor, tente novamente.");
      return;
    }

    await updateFirestoreDoc({
      documentPath: `/companies/${companyData.id}`,
      data: { endedAt: Timestamp.now() }
    });

    if (companyData?.aptManagerId) {
      await updateFirestoreDoc({
        documentPath: `/users/${companyData?.aptManagerId}`,
        data: { endedAt: Timestamp.now() }
      });
    }

    const updatePromises =
      condoData?.map(async (condo) => {
        return updateFirestoreDoc({
          documentPath: `/condominium/${condo.id}`,
          data: { endedAt: Timestamp.now() }
        });
      }) ?? [];

    await Promise.all(updatePromises);

    queryClient.invalidateQueries(["companies"]);
    queryClient.invalidateQueries(["condominiums", companyData.id]);
    successToast("Empresa e seus condomínios encerrados com sucesso!");
    router.push("/admin");
  };

  const handleConfirmClick = () => {
    if (inputValue === companyData.name) {
      handleEndCompany();
    } else {
      errorToast(
        "O nome da empresa não corresponde. Por favor, tente novamente."
      );
    }
  };

  return (
    <TransitionModal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title="Deseja mesmo encerrar a empresa?"
      description="Ao encerrar a empresa, todos os condomínios cadastrados serão encerrados também."
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
        name="company"
        label={companyData.name}
        className={inputClassName}
        placeholder="Digite Aqui"
        value={inputValue}
        onChange={handleInputChange}
      />
    </TransitionModal>
  );
};

export default CreateDeleteCompanyModal;
