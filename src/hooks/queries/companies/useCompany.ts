import { useQuery } from "@tanstack/react-query";
import { DocumentData } from "firebase/firestore";

import { CompanyEntity } from "@/common/entities/company";
import { getFirestoreDoc } from "@/store/services";
import {
  FORTY_FIVE_MINUTES_IN_MS,
  ONE_DAY_IN_MS
} from "@common/constants/generic";

export function getCompanyQueryKey(id: string) {
  return ["companies", id];
}

export const getCompanyQueryFn = (id: string) => {
  return () =>
    getFirestoreDoc<CompanyEntity>({
      documentPath: `/companies/${id}`
    }).then((res) => res.data);
};

const useCompany = <T = CompanyEntity>(
  id: string,
  select?: (data: DocumentData) => T
) => {
  return useQuery({
    queryKey: getCompanyQueryKey(id),
    queryFn: getCompanyQueryFn(id),
    select,
    staleTime: FORTY_FIVE_MINUTES_IN_MS,
    cacheTime: ONE_DAY_IN_MS
  });
};

export default useCompany;
