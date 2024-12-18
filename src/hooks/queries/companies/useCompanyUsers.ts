import { useQuery } from "@tanstack/react-query";
import { DocumentData } from "firebase/firestore";

import {
  FORTY_FIVE_MINUTES_IN_MS,
  ONE_DAY_IN_MS
} from "@/common/constants/generic";
import { AptManagerEntity } from "@/common/entities/aptManager";
import { getFirestoreCollection } from "@/store/services";

export function getUsersQueryKey(id: string) {
  return ["users", id];
}

export const getUsersQueryFn = (id: string) => {
  return () =>
    getFirestoreCollection<AptManagerEntity>({
      collectionPath: "users",
      filters: [{ field: "companyId", operator: "==", value: id }]
    }).then((res) => res.data);
};

const useCompanyUsers = <T = AptManagerEntity[]>(
  id: string,
  select?: (data: DocumentData) => T
) => {
  return useQuery({
    queryKey: getUsersQueryKey(id),
    queryFn: getUsersQueryFn(id),
    select,
    staleTime: FORTY_FIVE_MINUTES_IN_MS,
    cacheTime: ONE_DAY_IN_MS
  });
};

export default useCompanyUsers;
