import { useQuery } from "@tanstack/react-query";
import { DocumentData } from "firebase/firestore";

import { PetEntity } from "@/common/entities/pet";
import { getFirestoreCollection } from "@/store/services";
import {
  FORTY_FIVE_MINUTES_IN_MS,
  ONE_DAY_IN_MS
} from "@common/constants/generic";

export function getPetsByResidentQueryKey(residentId: string) {
  return ["pets", residentId];
}

export const getPetsByResidentQueryFn = (residentId: string) => {
  return () =>
    getFirestoreCollection({
      collectionPath: "pets",
      filters: [{ field: "userId", operator: "==", value: residentId }]
    }).then((res) => res.data);
};

const usePetsByResident = <T = PetEntity[]>(
  residentId: string,
  select?: (data: DocumentData) => T
) => {
  return useQuery({
    queryKey: getPetsByResidentQueryKey(residentId),
    queryFn: getPetsByResidentQueryFn(residentId),
    select,
    staleTime: FORTY_FIVE_MINUTES_IN_MS,
    cacheTime: ONE_DAY_IN_MS
  });
};

export default usePetsByResident;
