import { useQuery } from "@tanstack/react-query";
import { DocumentData } from "firebase/firestore";

import { VisitEntity } from "@/common/entities/visits";
import { getFirestoreCollection } from "@/store/services";
import { ONE_DAY_IN_MS } from "@common/constants/generic";

export function getVisitsByCondoIdQueryKey(condoId: string | undefined) {
  return ["visits", condoId];
}

export const getVisitsByCondoIdQueryFn = (condoId: string | undefined) => {
  return () =>
    getFirestoreCollection({
      collectionPath: "visits",
      filters: [{ field: "condominiumId", operator: "==", value: condoId }]
    }).then((res) => res.data);
};

const useVisitsByCondoId = <T = VisitEntity[]>(
  condoId: string | undefined,
  select?: (data: DocumentData) => T
) => {
  return useQuery({
    queryKey: getVisitsByCondoIdQueryKey(condoId),
    queryFn: getVisitsByCondoIdQueryFn(condoId),
    select,
    cacheTime: ONE_DAY_IN_MS,
    enabled: !!condoId
  });
};

export default useVisitsByCondoId;
