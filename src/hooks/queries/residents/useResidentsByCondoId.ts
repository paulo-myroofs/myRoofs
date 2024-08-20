import { useQuery } from "@tanstack/react-query";
import { DocumentData } from "firebase/firestore";

import { ResidentEntity } from "@/common/entities/resident";
import { getFirestoreCollection } from "@/store/services";
import {
  FORTY_FIVE_MINUTES_IN_MS,
  ONE_DAY_IN_MS
} from "@common/constants/generic";

export function getResidentsByCondoIdQueryKey(condoCode: string) {
  return ["residents", condoCode];
}

export const getResidentsByCondoIdQueryFn = (condoCode: string) => {
  return () =>
    getFirestoreCollection({
      collectionPath: "users",
      filters: [
        { field: "condominiumCode", operator: "==", value: condoCode },
        { field: "role", operator: "==", value: "resident" }
      ]
    }).then((res) => res.data);
};

const useResidentsByCondoId = <T = ResidentEntity[]>(
  condoCode: string,
  select?: (data: DocumentData) => T
) => {
  return useQuery({
    queryKey: getResidentsByCondoIdQueryKey(condoCode),
    queryFn: getResidentsByCondoIdQueryFn(condoCode),
    select,
    staleTime: FORTY_FIVE_MINUTES_IN_MS,
    cacheTime: ONE_DAY_IN_MS
  });
};

export default useResidentsByCondoId;
