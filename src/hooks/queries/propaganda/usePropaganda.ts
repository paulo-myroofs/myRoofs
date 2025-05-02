import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { createFirestoreDoc, getFirestoreDocs } from "@/store/services";
import { errorToast, successToast } from "@/hooks/useAppToast";

interface Propaganda {
    id?: string;
    imageUrl: string;
    createdAt?: Date;
}

export const usePropaganda = (condoId: string) => {
    const [loading, setLoading] = useState(false);
    const [propagandas, setPropagandas] = useState<Propaganda[]>([]);

    const fetchPropagandas = async () => {
        setLoading(true);
        try {
            const docs = await getFirestoreDocs<Propaganda>({
                collectionPath: `condo/${condoId}/propaganda`
            });
            setPropagandas(docs);
        } catch (error) {
            errorToast("Erro ao buscar propagandas. Tente novamente.")
        } finally {
            setLoading(false);
        }
    };

    const savePropaganda = async (imageUrl: string) => {
        if (propagandas.length >= 4) {
            return errorToast("Você só pode adicionar até 4 propagandas.");
        }

        setLoading(true);
        try {
            await createFirestoreDoc({
                collectionPath: `condominiums/${condoId}/propagandas`,
                data: {
                    imageUrl,
                    createdAt: new Date()
                }
            });
            successToast("Propaganda adicionada com sucesso.");
            queryClient.invalidateQueries(["propagandas", condoId]);
            await fetchPropagandas();
        } catch (error) {
            errorToast("Erro ao salvar propaganda. Tente novamente.");
        } finally {
            setLoading(false);
        }
    };

    return {
        propagandas,
        loading,
        fetchPropagandas,
        savePropaganda
    };
};