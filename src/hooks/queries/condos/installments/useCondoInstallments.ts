import { useQuery } from "@tanstack/react-query";
import { DocumentData } from "firebase/firestore";

import { InstallmentEntity } from "@/common/entities/common/condo/installment";
import { getFirestoreCollection } from "@/store/services";
import {
  FORTY_FIVE_MINUTES_IN_MS,
  ONE_DAY_IN_MS
} from "@common/constants/generic";

export function getCondoInstallmentsQueryKey(condoId: string) {
  return ["installments", condoId];
}

export const getCondoInstallmentsQueryFn = (condoId: string) => {
  return () =>
    getFirestoreCollection({
      collectionPath: `installments`,
      filters: [{ field: "condominiumId", operator: "==", value: condoId }]
    }).then((res) => res.data);
};

const useCondoInstallments = <T = InstallmentEntity[]>(
  condoId: string,
  select?: (data: DocumentData) => T
) => {
  return useQuery({
    queryKey: getCondoInstallmentsQueryKey(condoId),
    queryFn: getCondoInstallmentsQueryFn(condoId),
    select,
    staleTime: FORTY_FIVE_MINUTES_IN_MS,
    cacheTime: ONE_DAY_IN_MS,
    enabled: !!condoId
  });
};

export default useCondoInstallments;
