import { useQuery } from "@tanstack/react-query";
import { DocumentData } from "firebase/firestore";

import { CondoEntity } from "@/common/entities/common/condo/condo";
import { getFirestoreCollection } from "@/store/services";
import {
  FORTY_FIVE_MINUTES_IN_MS,
  ONE_DAY_IN_MS
} from "@common/constants/generic";

export function getEndedCondosIdQueryKey() {
  return ["condominium", "endedCondominium"];
}

export const getEndedCondosIdQueryFn = () => {
  return () =>
    getFirestoreCollection({
      collectionPath: "condominium",
      filters: [{ field: "endedAt", operator: "!=", value: null }]
    }).then((res) => res.data);
};

const useEndedCondos = <T = CondoEntity[]>(
  select?: (data: DocumentData) => T
) => {
  return useQuery({
    queryKey: getEndedCondosIdQueryKey(),
    queryFn: getEndedCondosIdQueryFn(),
    select,
    staleTime: FORTY_FIVE_MINUTES_IN_MS,
    cacheTime: ONE_DAY_IN_MS
  });
};

export default useEndedCondos;
