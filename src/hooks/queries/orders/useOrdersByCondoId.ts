import { useQuery } from "@tanstack/react-query";
import { DocumentData } from "firebase/firestore";

import { OrderEntity } from "@/common/entities/order";
import { getFirestoreCollection } from "@/store/services";
import { ONE_DAY_IN_MS } from "@common/constants/generic";

export function getOrdersByCondoIdQueryKey(condoId: string | undefined) {
  return ["orders", condoId];
}

export const getOrdersByCondoIdQueryFn = (condoId: string | undefined) => {
  return () =>
    getFirestoreCollection({
      collectionPath: "orders",
      filters: [{ field: "condominiumId", operator: "==", value: condoId }]
    }).then((res) => res.data);
};

const useOrdersByCondoId = <T = OrderEntity[]>(
  condoId: string | undefined,
  select?: (data: DocumentData) => T
) => {
  return useQuery({
    queryKey: getOrdersByCondoIdQueryKey(condoId),
    queryFn: getOrdersByCondoIdQueryFn(condoId),
    select,
    cacheTime: ONE_DAY_IN_MS,
    enabled: !!condoId
  });
};

export default useOrdersByCondoId;
