import { useState } from "react";

import { Timestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";

import { inputClassName } from "@/app/contants";
import Button from "@/components/atoms/Button/button";
import TransitionModal from "@/components/atoms/TransitionModal/tempModal";
import InputFieldForDelete from "@/components/molecules/InputField/InputFieldForDelete";
import useCompanyUsers from "@/hooks/queries/companies/useCompanyUsers";
import useEmployeesByCondoData from "@/hooks/queries/employee/useEmployeebyCondoData";
import useResidentsByCondoData from "@/hooks/queries/residents/useResidentsbyCondoData";
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
  const { data: aptManagerData } = useCompanyUsers(companyData.id as string);
  const { data: employeeData } = useEmployeesByCondoData(condoData);
  const { data: residentData } = useResidentsByCondoData(condoData);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
  };

  const handleBlockCompany = async () => {
    const managerPromises = aptManagerData?.map(
      async (manager: { id: string }) => {
        const { error } = await deactivateUserAuth(manager.id);
        return error;
      }
    );

    const managerResults = await Promise.all(managerPromises || []);

    if (managerResults.some((result) => result !== null)) {
      errorToast("Erro ao bloquear a empresa. Por favor, tente novamente.");
      return;
    }

    const employeePromises = employeeData?.map(
      async (employee: { id: string }) => {
        const { error } = await deactivateUserAuth(employee.id);
        return error;
      }
    );

    const employeeResults = await Promise.all(employeePromises || []);

    if (employeeResults.some((result) => result !== null)) {
      errorToast("Erro ao bloquear a empresa. Por favor, tente novamente.");
      return;
    }

    const residentPromises = residentData?.map(
      async (resident: { id: string }) => {
        const { error } = await deactivateUserAuth(resident.id);
        return error;
      }
    );

    const residentResults = await Promise.all(residentPromises || []);

    if (residentResults.some((result) => result !== null)) {
      errorToast("Erro ao bloquear a empresa. Por favor, tente novamente.");
      return;
    }

    await updateFirestoreDoc({
      documentPath: `/companies/${companyData.id}`,
      data: { blockedAt: Timestamp.now() }
    });

    queryClient.invalidateQueries(["companies", "activeCompanies"]);
    queryClient.invalidateQueries(["companies", "blockedCompanies"]);
    queryClient.invalidateQueries(["companies", companyData.id]);
    queryClient.invalidateQueries(["users", companyData.id]);
    queryClient.invalidateQueries(["employees", condoData]);
    queryClient.invalidateQueries(["residents", condoData]);
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
