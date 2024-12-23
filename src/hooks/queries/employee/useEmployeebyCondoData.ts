import { useQuery } from "@tanstack/react-query";
import { DocumentData } from "firebase/firestore";

import {
  FORTY_FIVE_MINUTES_IN_MS,
  ONE_DAY_IN_MS
} from "@/common/constants/generic";
import { CondoEntity } from "@/common/entities/common/condo/condo";
import { EmployeeEntity } from "@/common/entities/employee";
import { getFirestoreCollection } from "@/store/services";

export function getEmployeeQueryKey() {
  return ["employees", "condo"];
}

export const getEmployeesQueryFn = async (condoData: CondoEntity[]) => {
  if (!condoData || condoData.length === 0) {
    return [];
  }
  const condoIds = condoData.map((condo) => condo.id);
  const { data, error } = await getFirestoreCollection<EmployeeEntity>({
    collectionPath: "users",
    filters: [
      { field: "condominiumCode", operator: "in", value: condoIds },
      { field: "role", operator: "==", value: "employee" }
    ]
  });
  if (error) {
    return;
  }
  return data;
};

const useEmployeesByCondoData = <T = EmployeeEntity[]>(
  condoData: CondoEntity[],
  select?: (data: DocumentData) => T
) => {
  return useQuery({
    queryKey: getEmployeeQueryKey(),
    queryFn: () => getEmployeesQueryFn(condoData),
    select,
    staleTime: FORTY_FIVE_MINUTES_IN_MS,
    cacheTime: ONE_DAY_IN_MS
  });
};

export default useEmployeesByCondoData;
