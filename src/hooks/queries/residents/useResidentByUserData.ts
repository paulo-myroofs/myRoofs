// preciso de um hook que retorne um residente pela sua formationName, housingName e name

import { useQuery } from "@tanstack/react-query";
import { DocumentData } from "firebase/firestore";

import { ResidentEntity } from "@/common/entities/resident";
import { getFirestoreCollection } from "@/store/services";
import { ONE_DAY_IN_MS } from "@common/constants/generic";

export function getResidentsByUserDataQueryKey(
  formation: string,
  housing: string,
  name: string
) {
  return ["residents", formation, housing, name];
}

export const getResidentsByUserDataQueryFn = (
  formation: string,
  housing: string,
  name: string
) => {
  return () =>
    getFirestoreCollection({
      collectionPath: "users",
      filters: [
        { field: "formationName", operator: "==", value: formation },
        { field: "housingName", operator: "==", value: housing },
        { field: "name", operator: "==", value: name },
        { field: "role", operator: "==", value: "resident" }
      ]
    }).then((res) => res.data);
};

const useResidentsByUserData = <T = ResidentEntity[]>(
  formation: string,
  housing: string,
  name: string,
  select?: (data: DocumentData) => T
) => {
  return useQuery({
    queryKey: getResidentsByUserDataQueryKey(formation, housing, name),
    queryFn: getResidentsByUserDataQueryFn(formation, housing, name),
    select,
    cacheTime: ONE_DAY_IN_MS
  });
};

export default useResidentsByUserData;
