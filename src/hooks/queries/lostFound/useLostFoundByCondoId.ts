import { useQuery } from "@tanstack/react-query";
import { DocumentData } from "firebase/firestore";

import { LostFound } from "@/common/entities/lostAndFound";
import { getFirestoreCollection } from "@/store/services";
import {
  FORTY_FIVE_MINUTES_IN_MS,
  ONE_DAY_IN_MS
} from "@common/constants/generic";

export function getLostFoundByCondoIdQueryKey(condoCode: string) {
  return ["lostFound", condoCode];
}

export const getLostFoundByCondoIdQueryFn = (condoCode: string) => {
  return () =>
    getFirestoreCollection({
      collectionPath: "lost-and-found",
      filters: [{ field: "condominiumId", operator: "==", value: condoCode }]
    }).then((res) => res.data);
};

const useLostFoundByCondoId = <T = LostFound[]>(
  condoCode: string,
  select?: (data: DocumentData) => T
) => {
  return useQuery({
    queryKey: getLostFoundByCondoIdQueryKey(condoCode),
    queryFn: getLostFoundByCondoIdQueryFn(condoCode),
    select,
    staleTime: FORTY_FIVE_MINUTES_IN_MS,
    cacheTime: ONE_DAY_IN_MS
  });
};

export default useLostFoundByCondoId;
