import { useQuery } from "@tanstack/react-query";
import { DocumentData } from "firebase/firestore";

import { CondoNoticeEntity } from "@/common/entities/notices/condoNotices";
import { getFirestoreCollection } from "@/store/services";
import {
  FORTY_FIVE_MINUTES_IN_MS,
  ONE_DAY_IN_MS
} from "@common/constants/generic";

export function getCondoNoticesQueryKey(condoId: string) {
  return ["condoNotices", condoId];
}

export const getCondoNoticesQueryFn = (condoId: string) => {
  return () =>
    getFirestoreCollection({
      collectionPath: "condoNotices",
      filters: [{ field: "condominiumId", operator: "==", value: condoId }]
    }).then((res) => res.data);
};

const useCondoNotices = <T = CondoNoticeEntity[]>(
  condoId: string,
  select?: (data: DocumentData) => T
) => {
  return useQuery({
    queryKey: getCondoNoticesQueryKey(condoId),
    queryFn: getCondoNoticesQueryFn(condoId),
    select,
    staleTime: FORTY_FIVE_MINUTES_IN_MS,
    cacheTime: ONE_DAY_IN_MS
  });
};

export default useCondoNotices;
