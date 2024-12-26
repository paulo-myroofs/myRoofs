import { useQuery } from "@tanstack/react-query";
import { DocumentData } from "firebase/firestore";

import { AptManagerEntity } from "@/common/entities/aptManager";
import { CondoEntity } from "@/common/entities/common/condo/condo";
import { getFirestoreDoc, getFirestoreCollection } from "@/store/services";
import {
  // FORTY_FIVE_MINUTES_IN_MS,
  ONE_DAY_IN_MS
} from "@common/constants/generic";

export function getAdministratorByCondoIdQueryKey(condoCode: string) {
  return ["administrators", condoCode];
}

export const getAdministratorByCondoIdQueryKeyFn = async (
  condoCode: string
) => {
  const { error: condoError, data: condoData } =
    await getFirestoreDoc<CondoEntity>({
      documentPath: "/condominium/" + condoCode
    });
  if (condoError) {
    return;
  }
  const { error: adminError, data: adminData } = await getFirestoreCollection<
    AptManagerEntity[]
  >({
    collectionPath: "users",
    filters: [
      {
        field: "__name__",
        operator: "in",
        value: condoData?.aptManagersIds
      }
    ]
  });
  if (adminError) {
    return;
  }
  return adminData;
};

const useAdministratorsByCondoId = <T = AptManagerEntity[],>(
  condoCode: string,
  select?: (data: DocumentData) => T
) => {
  return useQuery({
    queryKey: getAdministratorByCondoIdQueryKey(condoCode),
    queryFn: () => getAdministratorByCondoIdQueryKeyFn(condoCode),
    select,
    staleTime: 0,
    cacheTime: ONE_DAY_IN_MS
  });
};

export default useAdministratorsByCondoId;
