import { useQuery } from "@tanstack/react-query";
import { DocumentData } from "firebase/firestore";

import { CondoEntity } from "@/common/entities/common/condo/condo";
import { getFirestoreCollection } from "@/store/services";
import {
  FORTY_FIVE_MINUTES_IN_MS,
  ONE_DAY_IN_MS
} from "@common/constants/generic";

export function getCondosByCompanyIdQueryKey(companyId: string) {
  return ["condominium", companyId];
}

export const getCondosByCompanyIdQueryFn = (companyId: string) => {
  return () =>
    getFirestoreCollection({
      collectionPath: "condominium",
      filters: [
        { field: "companyId", operator: "==", value: companyId },
        { field: "endedAt", operator: "==", value: null }
      ]
    }).then((res) => res.data);
};

const useCondosByCompanyId = <T = CondoEntity[]>(
  companyId: string,
  select?: (data: DocumentData) => T
) => {
  return useQuery({
    queryKey: getCondosByCompanyIdQueryKey(companyId),
    queryFn: getCondosByCompanyIdQueryFn(companyId),
    select,
    staleTime: FORTY_FIVE_MINUTES_IN_MS,
    cacheTime: ONE_DAY_IN_MS
  });
};

export default useCondosByCompanyId;
