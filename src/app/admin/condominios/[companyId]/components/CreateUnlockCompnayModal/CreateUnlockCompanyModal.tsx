import { useState } from "react";

import { useRouter } from "next/navigation";

import { inputClassName } from "@/app/contants";
import Button from "@/components/atoms/Button/button";
import LoadingComponent from "@/components/atoms/Loading/loading";
import TransitionModal from "@/components/atoms/TransitionModal/tempModal";
import InputFieldForDelete from "@/components/molecules/InputField/InputFieldForDelete";
import useCompanyUsers from "@/hooks/queries/companies/useCompanyUsers";
import useEmployeesByCondoData from "@/hooks/queries/employee/useEmployeebyCondoData";
import useResidentsByCondoData from "@/hooks/queries/residents/useResidentsbyCondoData";
import { successToast, errorToast } from "@/hooks/useAppToast";
import { queryClient } from "@/store/providers/queryClient";
import { updateFirestoreDoc } from "@/store/services";
import { activateUserAuth } from "@/store/services/auth";

import { CreateUnlockCompanyModalProps } from "./types";

const CreateUnlockCompanyModal = ({
  isOpen,
  onOpenChange,
  companyData,
  condoData
}: CreateUnlockCompanyModalProps) => {
  const [inputValue, setInputValue] = useState("");
  const [isUnlocking, setIsUnlocking] = useState(false);
  const router = useRouter();
  const { data: aptManagerData } = useCompanyUsers(companyData?.id as string);
  const { data: employeeData } = useEmployeesByCondoData(condoData);
  const { data: residentData } = useResidentsByCondoData(condoData);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
  };

  const handleUnlockCompany = async () => {
    setIsUnlocking(true);
    const managerPromises = aptManagerData?.map(
      async (manager: { id: string }) => {
        const { error } = await activateUserAuth(manager.id);
        return error;
      }
    );

    const managerResults = await Promise.all(managerPromises || []);

    if (managerResults.some((result) => result !== null)) {
      errorToast(
        "Erro ao desbloquear a administradora. Por favor, tente novamente."
      );
      return;
    }

    const employeePromises = employeeData?.map(
      async (employee: { id: string }) => {
        const { error } = await activateUserAuth(employee.id);
        return error;
      }
    );

    const employeeResults = await Promise.all(employeePromises || []);

    if (employeeResults.some((result) => result !== null)) {
      errorToast(
        "Erro ao desbloquear a administradora. Por favor, tente novamente."
      );
      setIsUnlocking(false);
      return;
    }

    const residentPromises = residentData?.map(
      async (resident: { id: string }) => {
        const { error } = await activateUserAuth(resident.id);
        return error;
      }
    );

    const residentResults = await Promise.all(residentPromises || []);

    if (residentResults.some((result) => result !== null)) {
      errorToast(
        "Erro ao desbloquear a administradora. Por favor, tente novamente."
      );
      setIsUnlocking(false);
      return;
    }

    await updateFirestoreDoc({
      documentPath: `/companies/${companyData?.id}`,
      data: { blockedAt: null }
    });

    queryClient.invalidateQueries(["companies", "activeCompanies"]);
    queryClient.invalidateQueries(["companies", "blockedCompanies"]);
    queryClient.invalidateQueries(["companies", companyData?.id]);
    successToast(
      "Administradora e seus condomínios desbloqueados com sucesso!"
    );
    router.push("/admin");
  };

  const handleConfirmClick = () => {
    if (inputValue === companyData?.name) {
      handleUnlockCompany();
    } else {
      errorToast(
        "O nome da administradora não corresponde. Por favor, tente novamente."
      );
    }
  };

  return (
    <TransitionModal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title="Deseja realmente desbloquear a administradora?"
      description="Ao desbloquear a administradora, todos os condomínios cadastrados serão desbloqueados também."
      confirmBtn={
        <Button
          variant="icon"
          size="lg"
          className=" w-[210px] bg-[#202425]"
          onClick={handleConfirmClick}
          disabled={isUnlocking}
        >
          {isUnlocking ? <LoadingComponent className="h-6 w-6" /> : "Confirmar"}
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
          disabled={isUnlocking}
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
        disabled={isUnlocking}
      />
    </TransitionModal>
  );
};

export default CreateUnlockCompanyModal;
