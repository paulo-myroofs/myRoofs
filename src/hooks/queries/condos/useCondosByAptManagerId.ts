import { useQuery } from "@tanstack/react-query";
import { DocumentData } from "firebase/firestore";

import { CondoEntity } from "@/common/entities/common/condo/condo";
import { getFirestoreCollection } from "@/store/services";
import {
  FORTY_FIVE_MINUTES_IN_MS,
  ONE_DAY_IN_MS
} from "@common/constants/generic";

export function getCondosByAptManagerIdQueryKey(aptManagerId: string) {
  return ["condominium", aptManagerId];
}

export const getCondosByAptManagerIdQueryFn = (aptManagerId: string) => {
  return () =>
    getFirestoreCollection({
      collectionPath: "condominium",
      filters: [
        {
          field: "aptManagersIds",
          operator: "array-contains",
          value: aptManagerId
        },
        { field: "endedAt", operator: "==", value: null }
      ]
    }).then((res) => res.data);
};

const useCondosByAptManagerId = <T = CondoEntity[]>(
  aptManagerId: string,
  select?: (data: DocumentData) => T
) => {
  return useQuery({
    queryKey: getCondosByAptManagerIdQueryKey(aptManagerId),
    queryFn: getCondosByAptManagerIdQueryFn(aptManagerId),
    select,
    staleTime: FORTY_FIVE_MINUTES_IN_MS,
    cacheTime: ONE_DAY_IN_MS
  });
};

export default useCondosByAptManagerId;
