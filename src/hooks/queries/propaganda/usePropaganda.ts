import { useQuery } from "@tanstack/react-query";

import { PropagandaEntity } from "@/common/entities/propaganda";
import { errorToast, successToast } from "@/hooks/useAppToast";
import { updateFirestoreDoc, getFirestoreDoc } from "@/store/services";

const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000;

export const getPropagandasQueryKey = (condoId: string) => [
  "propagandas",
  condoId
];

export const getPropagandasQueryFn = async (condoId: string) => {
  const { data, error } = await getFirestoreDoc({
    documentPath: `condominium/${condoId}`
  });

  if (error) {
    throw new Error("Erro ao buscar propagandas");
  }

  return data?.propagandas || [];
};

const usePropaganda = (condoId: string) => {
  const {
    data: propagandas = [],
    isLoading,
    isError,
    refetch
  } = useQuery({
    queryKey: getPropagandasQueryKey(condoId),
    queryFn: () => getPropagandasQueryFn(condoId),
    enabled: !!condoId,
    cacheTime: ONE_DAY_IN_MS,
    staleTime: 0
  });

  const savePropaganda = async (imageUrl: string) => {
    if (propagandas.length >= 4) {
      return errorToast("Você só pode adicionar até 4 propagandas.");
    }

    try {
      const updatedPropagandas = [
        ...propagandas,
        { imageUrl, createdAt: new Date() }
      ];
      await updateFirestoreDoc({
        documentPath: `condominium/${condoId}`,
        data: { propagandas: updatedPropagandas }
      });
      successToast("Propaganda adicionada com sucesso.");
      await refetch();
    } catch (error) {
      console.error("Erro ao salvar propaganda:", error);
      errorToast("Erro ao salvar propaganda. Tente novamente.");
    }
  };

  const updatePropaganda = async (index: number, newImageUrl: string) => {
    try {
      const updatedPropagandas = [...propagandas];
      updatedPropagandas[index] = {
        ...updatedPropagandas[index],
        imageUrl: newImageUrl
      };

      await updateFirestoreDoc({
        documentPath: `condominium/${condoId}`,
        data: { propagandas: updatedPropagandas }
      });
      successToast("Propaganda atualizada com sucesso.");
      await refetch();
    } catch (error) {
      console.error("Erro ao atualizar propaganda:", error);
      errorToast("Erro ao atualizar propaganda. Tente novamente.");
    }
  };

  const deletePropaganda = async (index: number) => {
    try {
      const updatedPropagandas = propagandas.filter(
        (_: PropagandaEntity, i: number) => i !== index
      );
      await updateFirestoreDoc({
        documentPath: `condominium/${condoId}`,
        data: { propagandas: updatedPropagandas }
      });
      successToast("Propaganda excluída com sucesso.");
      await refetch();
    } catch (error) {
      console.error("Erro ao excluir propaganda:", error);
      errorToast("Erro ao excluir propaganda. Tente novamente.");
    }
  };

  return {
    propagandas,
    isLoading,
    isError,
    savePropaganda,
    updatePropaganda,
    deletePropaganda
  };
};

export default usePropaganda;
