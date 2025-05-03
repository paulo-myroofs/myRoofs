import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { createFirestoreDoc, getFirestoreCollection } from "@/store/services";
import { errorToast, successToast } from "@/hooks/useAppToast";

interface Propaganda {
    id?: string;
    imageUrl: string;
    createdAt?: Date;
}

export function getPropagandasQueryKey(condoId: string) {
    return ["propagandas", condoId];
}

export const getPropagandasQueryFn = (condoId: string) => {
    return () =>
        getFirestoreCollection<Propaganda>({
            collectionPath: `condominiums/${condoId}/propagandas`
        }).then((res) => res.data);
};

export const usePropaganda = (condoId: string) => {
    const { data: propagandas = [], isLoading: loading, refetch } = useQuery({
        queryKey: getPropagandasQueryKey(condoId),
        queryFn: getPropagandasQueryFn(condoId),
        enabled: !!condoId
    });

    const savePropaganda = async (imageUrl: string) => {
        if (propagandas.length >= 4) {
            return errorToast("Você só pode adicionar até 4 propagandas.");
        }

        try {
            await createFirestoreDoc({
                collectionPath: `condominiums/${condoId}/propagandas`,
                data: {
                    imageUrl,
                    createdAt: new Date()
                }
            });
            successToast("Propaganda adicionada com sucesso.");
            refetch();
        } catch (error) {
            errorToast("Erro ao salvar propaganda. Tente novamente.");
        }
    };

    return {
        propagandas,
        loading,
        savePropaganda
    };
};