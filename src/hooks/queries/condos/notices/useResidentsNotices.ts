import { useQuery } from "@tanstack/react-query";
import { DocumentData } from "firebase/firestore";

import { NoticeEntity } from "@/common/entities/notices/notices";
import { getFirestoreCollection } from "@/store/services";
import {
  FORTY_FIVE_MINUTES_IN_MS,
  ONE_DAY_IN_MS
} from "@common/constants/generic";

export function getResidentsNoticesQueryKey(condoId: string) {
  return ["notices", condoId];
}

export const getResidentsNoticesQueryFn = (condoId: string) => {
  return () =>
    getFirestoreCollection({
      collectionPath: "notices",
      filters: [{ field: "condominiumId", operator: "==", value: condoId }]
    }).then((res) => res.data);
};

const useResidentsNotices = <T = NoticeEntity[]>(
  condoId: string,
  select?: (data: DocumentData) => T
) => {
  return useQuery({
    queryKey: getResidentsNoticesQueryKey(condoId),
    queryFn: getResidentsNoticesQueryFn(condoId),
    select,
    staleTime: FORTY_FIVE_MINUTES_IN_MS,
    cacheTime: ONE_DAY_IN_MS
  });
};

export default useResidentsNotices;
