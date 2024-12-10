import { useState } from "react";

import { useRouter } from "next/navigation";

import { inputClassName } from "@/app/contants";
import Button from "@/components/atoms/Button/button";
import TransitionModal from "@/components/atoms/TransitionModal/tempModal";
import InputFieldForDelete from "@/components/molecules/InputField/InputFieldForDelete";
import useCondosByCompanyId from "@/hooks/queries/condos/useCondosByCompanyId";
import { successToast, errorToast } from "@/hooks/useAppToast";
import { queryClient } from "@/store/providers/queryClient";
import { updateFirestoreDoc } from "@/store/services";
import { activateUserAuth } from "@/store/services/auth";

import { CreateUnlockCompanyModalProps } from "./types";

const CreateUnlockCompanyModal = ({
  isOpen,
  onOpenChange,
  companyData
}: CreateUnlockCompanyModalProps) => {
  const [inputValue, setInputValue] = useState("");
  const { data: condoData } = useCondosByCompanyId(companyData?.id as string);
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
  };

  const handleBlockCompany = async () => {
    const { error } = await activateUserAuth(
      companyData?.aptManagerId as string
    );
    if (error) {
      errorToast("Erro ao desbloquear a empresa. Por favor, tente novamente.");
      return;
    }
    await updateFirestoreDoc({
      documentPath: `/companies/${companyData?.id}`,
      data: { blockedAt: null }
    });
    if (companyData?.aptManagerId) {
      await updateFirestoreDoc({
        documentPath: `/users/${companyData?.aptManagerId}`,
        data: { blockedAt: null }
      });
    }
    const updatePromises =
      condoData?.map(async (condo) => {
        return updateFirestoreDoc({
          documentPath: `/condominium/${condo.id}`,
          data: { blcokedAt: null }
        });
      }) ?? [];
    await Promise.all(updatePromises);
    queryClient.invalidateQueries(["companies", "activeCompanies"]);
    queryClient.invalidateQueries(["companies", "blockedCompanies"]);
    queryClient.invalidateQueries(["companies", companyData?.id]);
    queryClient.invalidateQueries(["condominiums", companyData?.id]);
    successToast("Empresa e seus condomínios desbloqueados com sucesso!");
    router.push("/admin");
  };

  const handleConfirmClick = () => {
    if (inputValue === companyData?.name) {
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
      title="Deseja realmente desbloquear a empresa?"
      description="Ao desbloquear a empresa, todos os condomínios cadastrados serão desbloqueados também."
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
        label={companyData?.name}
        className={inputClassName}
        placeholder="Digite Aqui"
        value={inputValue}
        onChange={handleInputChange}
      />
    </TransitionModal>
  );
};

export default CreateUnlockCompanyModal;
