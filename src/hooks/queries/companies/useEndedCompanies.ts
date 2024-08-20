import { useQuery } from "@tanstack/react-query";
import { DocumentData } from "firebase/firestore";

import { CompanyEntity } from "@/common/entities/company";
import { getFirestoreCollection } from "@/store/services";
import {
  FORTY_FIVE_MINUTES_IN_MS,
  ONE_DAY_IN_MS
} from "@common/constants/generic";

export function getEndedCompaniesQueryKey() {
  return ["companies", "endedCompanies"];
}

export const getEndedCompaniesQueryFn = () => {
  return () =>
    getFirestoreCollection<CompanyEntity[]>({
      collectionPath: "companies",
      filters: [{ field: "endedAt", operator: "!=", value: null }]
    }).then((res) => res.data);
};

const useEndedCompanies = <T = CompanyEntity[]>(
  select?: (data: DocumentData) => T
) => {
  return useQuery({
    queryKey: getEndedCompaniesQueryKey(),
    queryFn: getEndedCompaniesQueryFn(),
    select,
    staleTime: FORTY_FIVE_MINUTES_IN_MS,
    cacheTime: ONE_DAY_IN_MS
  });
};

export default useEndedCompanies;
