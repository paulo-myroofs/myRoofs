import { useQuery } from "@tanstack/react-query";
import { DocumentData } from "firebase/firestore";

import { OccurrenceEntity } from "@/common/entities/occurrences";
import { getFirestoreCollection } from "@/store/services";
import { ONE_DAY_IN_MS } from "@common/constants/generic";

export function getUseOccurrencesByCondoIdKey(condoId: string) {
  return ["occurrences", condoId];
}

export const getUseOccurrencesByCondoIdFn = (condoId: string) => {
  return () =>
    getFirestoreCollection({
      collectionPath: "occurrences",
      filters: [{ field: "condominiumId", operator: "==", value: condoId }]
    }).then((res) => res.data);
};

const useOccurrencesByCondoId = <T = OccurrenceEntity[]>(
  condoId: string,
  select?: (data: DocumentData) => T
) => {
  return useQuery({
    queryKey: getUseOccurrencesByCondoIdKey(condoId),
    queryFn: getUseOccurrencesByCondoIdFn(condoId),
    select,
    cacheTime: ONE_DAY_IN_MS
  });
};

export default useOccurrencesByCondoId;
