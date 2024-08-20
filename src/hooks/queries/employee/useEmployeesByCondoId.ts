import { useQuery } from "@tanstack/react-query";
import { DocumentData } from "firebase/firestore";

import { EmployeeEntity } from "@/common/entities/employee";
import { getFirestoreCollection } from "@/store/services";
import {
  FORTY_FIVE_MINUTES_IN_MS,
  ONE_DAY_IN_MS
} from "@common/constants/generic";

export function getEmployeesByCondoIdQueryKey(condoCode: string) {
  return ["employees", condoCode];
}

export const getEmployeesByCondoIdQueryFn = (condoCode: string) => {
  return () =>
    getFirestoreCollection({
      collectionPath: "users",
      filters: [
        { field: "condominiumCode", operator: "==", value: condoCode },
        { field: "role", operator: "==", value: "employee" }
      ]
    }).then((res) => res.data);
};

const useEmployeesByCondoId = <T = EmployeeEntity[]>(
  condoCode: string,
  select?: (data: DocumentData) => T
) => {
  return useQuery({
    queryKey: getEmployeesByCondoIdQueryKey(condoCode),
    queryFn: getEmployeesByCondoIdQueryFn(condoCode),
    select,
    staleTime: FORTY_FIVE_MINUTES_IN_MS,
    cacheTime: ONE_DAY_IN_MS
  });
};

export default useEmployeesByCondoId;
