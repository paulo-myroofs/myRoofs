import { useQuery } from "@tanstack/react-query";
import { DocumentData } from "firebase/firestore";

import { AdministratorEntity } from "@/common/entities/administrator";
import { getFirestoreCollection } from "@/store/services";
import {
  FORTY_FIVE_MINUTES_IN_MS,
  ONE_DAY_IN_MS
} from "@common/constants/generic";

export function getAdministratorByCondoIdQueryKey(condoCode: string) {
  return ["administrator", condoCode];
}

export const getAdministratorByCondoIdQueryFn = (condoCode: string) => {
  return () =>
    getFirestoreCollection({
      collectionPath: "users",
      filters: [
        { field: "condominiumCode", operator: "==", value: condoCode },
        { field: "role", operator: "==", value: "aptManager" }
      ]
    }).then((res) => res.data);
};

const useAdministratorByCondoId = <T = AdministratorEntity[]>(
  condoCode: string,
  select?: (data: DocumentData) => T
) => {
  return useQuery({
    queryKey: getAdministratorByCondoIdQueryKey(condoCode),
    queryFn: getAdministratorByCondoIdQueryFn(condoCode),
    select,
    staleTime: FORTY_FIVE_MINUTES_IN_MS,
    cacheTime: ONE_DAY_IN_MS
  });
};

export default useAdministratorByCondoId;