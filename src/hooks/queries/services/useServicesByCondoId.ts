import { useQuery } from "@tanstack/react-query";
import { DocumentData } from "firebase/firestore";

import { ServiceEntity } from "@/common/entities/service";
import { getFirestoreCollection } from "@/store/services";
import {
  FORTY_FIVE_MINUTES_IN_MS,
  ONE_DAY_IN_MS
} from "@common/constants/generic";

export function getServicesByCondoIdQueryKey(condoId: string | undefined) {
  return ["services", condoId];
}

export const getServicesByCondoIdQueryFn = (condoId: string | undefined) => {
  return () =>
    getFirestoreCollection({
      collectionPath: "services",
      filters: [{ field: "condominiumId", operator: "==", value: condoId }]
    }).then((res) => res.data);
};

const useServicesByCondoId = <T = ServiceEntity[]>(
  condoId: string | undefined,
  select?: (data: DocumentData) => T
) => {
  return useQuery({
    queryKey: getServicesByCondoIdQueryKey(condoId),
    queryFn: getServicesByCondoIdQueryFn(condoId),
    select,
    staleTime: FORTY_FIVE_MINUTES_IN_MS,
    cacheTime: ONE_DAY_IN_MS,
    enabled: !!condoId
  });
};

export default useServicesByCondoId;
