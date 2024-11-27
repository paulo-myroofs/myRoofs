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
import { deactivateUserAuth } from "@/store/services/auth";

import { CreateBlockCompanyModalProps } from "./types";

const CreateBlockCompanyModal = ({
  isOpen,
  onOpenChange,
  companyData,
  condoData
}: CreateBlockCompanyModalProps) => {
  const router = useRouter();
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
  };

  const handleBlockCompany = async () => {
    const { error } = await deactivateUserAuth(
      companyData?.aptManagerId as string
    );
    if (error) {
      errorToast("Erro ao bloquear a empresa. Por favor, tente novamente.");
      return;
    }
    await updateFirestoreDoc({
      documentPath: `/companies/${companyData.id}`,
      data: { blockedAt: Timestamp.now() }
    });
    if (companyData?.aptManagerId) {
      await updateFirestoreDoc({
        documentPath: `/users/${companyData?.aptManagerId}`,
        data: { blockedAt: Timestamp.now() }
      });
    }
    const updatePromises =
      condoData?.map(async (condo) => {
        return updateFirestoreDoc({
          documentPath: `/condominium/${condo.id}`,
          data: { blcokedAt: Timestamp.now() }
        });
      }) ?? [];
    await Promise.all(updatePromises);
    queryClient.invalidateQueries(["companies", "activeCompanies"]);
    queryClient.invalidateQueries(["condominiums", companyData.id]);
    successToast("Empresa e seus condomínios bloqueados com sucesso!");
    router.push("/admin");
  };

  const handleConfirmClick = () => {
    if (inputValue === companyData.name) {
      handleBlockCompany();
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
      title="Deseja realmente bloquear a empresa?"
      description="Ao bloquear a empresa, todos os condomínios cadastrados serão bloqueados também."
      confirmBtn={
        <Button
          variant="icon"
          size="lg"
          className=" w-[210px] bg-[#202425]"
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

export default CreateBlockCompanyModal;
