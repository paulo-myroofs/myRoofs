import { useQuery } from "@tanstack/react-query";
import { DocumentData } from "firebase/firestore";

import { TicketEntity } from "@/common/entities/common/condo/ticket";
import { getFirestoreCollection } from "@/store/services";
import {
  FORTY_FIVE_MINUTES_IN_MS,
  ONE_DAY_IN_MS
} from "@common/constants/generic";

export function getCondoTicketsQueryKey(condoId: string) {
  return ["tickets", condoId];
}

export const getCondoTicketsQueryFn = (condoId: string) => {
  return () =>
    getFirestoreCollection({
      collectionPath: `/tickets`,
      filters: [{ field: "condominiumId", operator: "==", value: condoId }]
    }).then((res) => res.data);
};

const useCondoTickets = <T = TicketEntity[]>(
  condoId: string,
  select?: (data: DocumentData) => T
) => {
  return useQuery({
    queryKey: getCondoTicketsQueryKey(condoId),
    queryFn: getCondoTicketsQueryFn(condoId),
    select,
    staleTime: FORTY_FIVE_MINUTES_IN_MS,
    cacheTime: ONE_DAY_IN_MS,
    enabled: !!condoId
  });
};

export default useCondoTickets;
