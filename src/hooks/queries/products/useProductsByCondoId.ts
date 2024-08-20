import { useQuery } from "@tanstack/react-query";
import { DocumentData } from "firebase/firestore";

import { ProductEntity } from "@/common/entities/product";
import { getFirestoreCollection } from "@/store/services";
import {
  FORTY_FIVE_MINUTES_IN_MS,
  ONE_DAY_IN_MS
} from "@common/constants/generic";

export function getProductsByCondoIdQueryKey(condoId: string | undefined) {
  return ["products", condoId];
}

export const getProductsByCondoIdQueryFn = (condoId: string | undefined) => {
  return () =>
    getFirestoreCollection({
      collectionPath: "products",
      filters: [{ field: "condominiumId", operator: "==", value: condoId }]
    }).then((res) => res.data);
};

const useProductsByCondoId = <T = ProductEntity[]>(
  condoId: string | undefined,
  select?: (data: DocumentData) => T
) => {
  return useQuery({
    queryKey: getProductsByCondoIdQueryKey(condoId),
    queryFn: getProductsByCondoIdQueryFn(condoId),
    select,
    staleTime: FORTY_FIVE_MINUTES_IN_MS,
    cacheTime: ONE_DAY_IN_MS,
    enabled: !!condoId
  });
};

export default useProductsByCondoId;
