import { useQuery } from "@tanstack/react-query";
import { DocumentData } from "firebase/firestore";

import { CondoEntity } from "@/common/entities/common/condo/condo";
import { getFirestoreDoc } from "@/store/services";
import { ONE_DAY_IN_MS } from "@common/constants/generic";

export function getCondoQueryKey(condoId: string) {
  return ["condominium", condoId];
}

export const getCondoQueryFn = (condoId: string) => {
  return () =>
    getFirestoreDoc({
      documentPath: "/condominium/" + condoId
    }).then((res) => res.data);
};

const useCondo = <T = CondoEntity>(
  condoId: string,
  select?: (data: DocumentData) => T
) => {
  return useQuery({
    queryKey: getCondoQueryKey(condoId),
    queryFn: getCondoQueryFn(condoId),
    select,
    cacheTime: ONE_DAY_IN_MS,
    enabled: !!condoId
  });
};

export default useCondo;
