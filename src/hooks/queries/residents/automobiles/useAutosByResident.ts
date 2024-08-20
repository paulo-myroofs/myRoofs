import { useQuery } from "@tanstack/react-query";
import { DocumentData } from "firebase/firestore";

import { AutomobileEntity } from "@/common/entities/automobile";
import { getFirestoreCollection } from "@/store/services";
import {
  FORTY_FIVE_MINUTES_IN_MS,
  ONE_DAY_IN_MS
} from "@common/constants/generic";

export function getAutomobilesByResidentQueryKey(residentId: string) {
  return ["automobiles", residentId];
}

export const getAutomobilesByResidentQueryFn = (residentId: string) => {
  return () =>
    getFirestoreCollection({
      collectionPath: "automobile",
      filters: [{ field: "userId", operator: "==", value: residentId }]
    }).then((res) => res.data);
};

const useAutosByResident = <T = AutomobileEntity[]>(
  residentId: string,
  select?: (data: DocumentData) => T
) => {
  return useQuery({
    queryKey: getAutomobilesByResidentQueryKey(residentId),
    queryFn: getAutomobilesByResidentQueryFn(residentId),
    select,
    staleTime: FORTY_FIVE_MINUTES_IN_MS,
    cacheTime: ONE_DAY_IN_MS
  });
};

export default useAutosByResident;
