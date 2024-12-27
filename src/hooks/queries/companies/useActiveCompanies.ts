import { useQuery } from "@tanstack/react-query";
import { DocumentData } from "firebase/firestore";

import { CompanyEntity } from "@/common/entities/company";
import { getFirestoreCollection } from "@/store/services";
import {
  FORTY_FIVE_MINUTES_IN_MS,
  ONE_DAY_IN_MS
} from "@common/constants/generic";

export function getActiveCompaniesQueryKey() {
  return ["companies", "activeCompanies"];
}

export const getActiveCompaniesQueryFn = () => {
  return () =>
    getFirestoreCollection<CompanyEntity[]>({
      collectionPath: "companies",
      filters: [
        { field: "endedAt", operator: "==", value: null },
        { field: "blockedAt", operator: "==", value: null }
      ]
    }).then((res) => res.data);
};

const useActiveCompanies = <T = CompanyEntity[]>(
  select?: (data: DocumentData) => T
) => {
  return useQuery({
    queryKey: getActiveCompaniesQueryKey(),
    queryFn: getActiveCompaniesQueryFn(),
    select,
    staleTime: FORTY_FIVE_MINUTES_IN_MS,
    cacheTime: ONE_DAY_IN_MS
  });
};

export default useActiveCompanies;
