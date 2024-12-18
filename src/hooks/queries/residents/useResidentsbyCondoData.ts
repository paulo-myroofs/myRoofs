import { useQuery } from "@tanstack/react-query";
import { DocumentData } from "firebase/firestore";

import {
  FORTY_FIVE_MINUTES_IN_MS,
  ONE_DAY_IN_MS
} from "@/common/constants/generic";
import { CondoEntity } from "@/common/entities/common/condo/condo";
import { ResidentEntity } from "@/common/entities/resident";
import { getFirestoreCollection } from "@/store/services";

export function getResidentsQueryKey() {
  return ["residents", "condo"];
}

export const getResidentsQueryFn = async (condoData: CondoEntity[]) => {
  if (!condoData || condoData.length === 0) {
    return [];
  }
  const condoIds = condoData.map((condo) => condo.id);
  const { data, error } = await getFirestoreCollection<ResidentEntity>({
    collectionPath: "users",
    filters: [
      { field: "condominiumCode", operator: "in", value: condoIds },
      { field: "role", operator: "==", value: "resident" }
    ]
  });
  if (error) {
    return;
  }
  return data;
};

const useResidentsByCondoData = <T = ResidentEntity[]>(
  condoData: CondoEntity[],
  select?: (data: DocumentData) => T
) => {
  return useQuery({
    queryKey: getResidentsQueryKey(),
    queryFn: () => getResidentsQueryFn(condoData),
    select,
    staleTime: FORTY_FIVE_MINUTES_IN_MS,
    cacheTime: ONE_DAY_IN_MS
  });
};

export default useResidentsByCondoData;
