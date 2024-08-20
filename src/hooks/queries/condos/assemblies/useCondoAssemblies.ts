import { useQuery } from "@tanstack/react-query";
import { DocumentData } from "firebase/firestore";

import { CondoAssembly } from "@/common/entities/notices/condoAssemblies";
import { getFirestoreCollection } from "@/store/services";
import {
  FORTY_FIVE_MINUTES_IN_MS,
  ONE_DAY_IN_MS
} from "@common/constants/generic";

export function getCondoAssembliesQueryKey(condoId: string) {
  return ["condoAssemblies", condoId];
}

export const getCondoAssembliesQueryFn = (condoId: string) => {
  return () =>
    getFirestoreCollection({
      collectionPath: "condoAssemblies",
      filters: [{ field: "condominiumId", operator: "==", value: condoId }]
    }).then((res) => res.data);
};

const useCondoAssemblies = <T = CondoAssembly[]>(
  condoId: string,
  select?: (data: DocumentData) => T
) => {
  return useQuery({
    queryKey: getCondoAssembliesQueryKey(condoId),
    queryFn: getCondoAssembliesQueryFn(condoId),
    select,
    staleTime: FORTY_FIVE_MINUTES_IN_MS,
    cacheTime: ONE_DAY_IN_MS
  });
};

export default useCondoAssemblies;
