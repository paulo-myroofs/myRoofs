import { useQuery } from "@tanstack/react-query";

import { advertisementEntity } from "@/common/entities/advertisement";
import { errorToast, successToast } from "@/hooks/useAppToast";
import { updateFirestoreDoc, getFirestoreDoc } from "@/store/services";

const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000;

export const getadvertisementsQueryKey = (condoId: string) => [
  "advertisements",
  condoId
];

export const getadvertisementsQueryFn = async (condoId: string) => {
  const { data, error } = await getFirestoreDoc({
    documentPath: `condominium/${condoId}`
  });

  if (error) {
    throw new Error("Erro ao buscar propagandas");
  }

  return data?.advertisements || [];
};

const useAdvertisement = (condoId: string) => {
  const {
    data: advertisements = [],
    isLoading,
    isError,
    refetch
  } = useQuery({
    queryKey: getadvertisementsQueryKey(condoId),
    queryFn: () => getadvertisementsQueryFn(condoId),
    enabled: !!condoId,
    cacheTime: ONE_DAY_IN_MS,
    staleTime: 0
  });

  const saveadvertisement = async (imageUrl: string) => {
    if (advertisements.length >= 4) {
      return errorToast("Você só pode adicionar até 4 propagandas.");
    }

    try {
      const updatedadvertisements = [
        ...advertisements,
        { imageUrl, createdAt: new Date() }
      ];
      await updateFirestoreDoc({
        documentPath: `condominium/${condoId}`,
        data: { advertisements: updatedadvertisements }
      });
      successToast("Propaganda adicionada com sucesso.");
      await refetch();
    } catch (error) {
      console.error("Erro ao salvar propaganda:", error);
      errorToast("Erro ao salvar propaganda. Tente novamente.");
    }
  };

  const updateadvertisement = async (index: number, newImageUrl: string) => {
    try {
      const updatedadvertisements = [...advertisements];
      updatedadvertisements[index] = {
        ...updatedadvertisements[index],
        imageUrl: newImageUrl
      };

      await updateFirestoreDoc({
        documentPath: `condominium/${condoId}`,
        data: { advertisements: updatedadvertisements }
      });
      successToast("Propaganda atualizada com sucesso.");
      await refetch();
    } catch (error) {
      console.error("Erro ao atualizar propaganda:", error);
      errorToast("Erro ao atualizar propaganda. Tente novamente.");
    }
  };

  const deleteadvertisement = async (index: number) => {
    try {
      const updatedadvertisements = advertisements.filter(
        (_: advertisementEntity, i: number) => i !== index
      );
      await updateFirestoreDoc({
        documentPath: `condominium/${condoId}`,
        data: { advertisements: updatedadvertisements }
      });
      successToast("Propaganda excluída com sucesso.");
      await refetch();
    } catch (error) {
      console.error("Erro ao excluir propaganda:", error);
      errorToast("Erro ao excluir propaganda. Tente novamente.");
    }
  };

  return {
    advertisements,
    isLoading,
    isError,
    saveadvertisement,
    updateadvertisement,
    deleteadvertisement
  };
};

export default useAdvertisement;
