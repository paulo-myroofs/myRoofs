import { useQuery } from "@tanstack/react-query";
import { DocumentData } from "firebase/firestore";

import { BookingEntity } from "@/common/entities/booking";
import { getFirestoreCollection } from "@/store/services";
import {
  FORTY_FIVE_MINUTES_IN_MS,
  ONE_DAY_IN_MS
} from "@common/constants/generic";

export function getBookingByCondoIdQueryKey(condoCode: string) {
  return ["bookings", condoCode];
}

export const getBookingByCondoIdQueryFn = (condoCode: string) => {
  return () =>
    getFirestoreCollection({
      collectionPath: "bookings",
      filters: [{ field: "condominiumId", operator: "==", value: condoCode }]
    }).then((res) => res.data);
};

const useBookingByCondoId = <T = BookingEntity[]>(
  condoCode: string,
  select?: (data: DocumentData) => T
) => {
  return useQuery({
    queryKey: getBookingByCondoIdQueryKey(condoCode),
    queryFn: getBookingByCondoIdQueryFn(condoCode),
    select,
    staleTime: FORTY_FIVE_MINUTES_IN_MS,
    cacheTime: ONE_DAY_IN_MS
  });
};

export default useBookingByCondoId;
