/* eslint-disable prettier/prettier */
"use client";

import { useEffect } from "react";

import { useRouter } from "next/navigation";

import { CondoEntity } from "@/common/entities/common/condo/condo";
import { EmployeeEntity } from "@/common/entities/employee";
import useEndedCondos from "@/hooks/queries/condos/useEndedCondos";
import useProfile from "@/hooks/queries/useProfile";
import { errorToast } from "@/hooks/useAppToast";
import useAuth from "@/hooks/useAuth";
import { logout } from "@/store/services/auth";
import FetchAuthState from "@templates/FetchAuth/fetchAuth";

interface Props {
  children: JSX.Element;
}

function EmployeeFeature({ children }: Props): JSX.Element {
  const { userUid } = useAuth();

  const { data: user } = useProfile<EmployeeEntity>(userUid);
  const { data: endedCondosIds } = useEndedCondos((data) =>
    data.map((item: CondoEntity) => item.id)
  );
  const router = useRouter();

  useEffect(() => {
    if (
      userUid &&
      user &&
      user.role === "employee" 
    ) {
      if (endedCondosIds?.includes(user.condominiumCode)) {
        logout();
        errorToast(
          "O condomínio associado a você foi encerrado. Entre em contato com o seu administrador."
        );
      }
    } else {
      router.push(`/`);
    }
  }, [userUid, router, user, endedCondosIds]);

  return children;
}

export default function EmployeeFeatureWrapper({
  children
}: Props): JSX.Element {
  return (
    <FetchAuthState>
      <EmployeeFeature>{children}</EmployeeFeature>
    </FetchAuthState>
  );
}
