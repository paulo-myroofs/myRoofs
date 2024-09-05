"use client";

import { useEffect } from "react";

import { usePathname, useRouter } from "next/navigation";

import { AptManagerEntity } from "@/common/entities/aptManager";
import { CompanyEntity } from "@/common/entities/company";
import useEndedCompanies from "@/hooks/queries/companies/useEndedCompanies";
import useProfile from "@/hooks/queries/useProfile";
import { errorToast } from "@/hooks/useAppToast";
import useAuth from "@/hooks/useAuth";
import { logout } from "@/store/services/auth";
import { storageGet } from "@/store/services/storage";
import FetchAuthState from "@templates/FetchAuth/fetchAuth";

interface Props {
  children: JSX.Element;
}

function AptManagerOnlyFeature({ children }: Props): JSX.Element {
  const { userUid } = useAuth();
  const pathname = usePathname();
  const condoId = storageGet<string>("condoId");

  const { data: user } = useProfile<AptManagerEntity>(userUid);
  const { data: endedCompaniesIds } = useEndedCompanies((data) =>
    data.map((item: CompanyEntity) => item.id)
  );
  const router = useRouter();

  useEffect(() => {
    if (user) {
      if (
        user.role !== "aptManager" ||
        endedCompaniesIds?.includes(user.companyId)
      ) {
        if (endedCompaniesIds?.includes(user.companyId)) {
          errorToast(
            "A empresa associada a você foi encerrada. Entre em contato com o seu administrador."
          );
          logout();
        }
        router.push(`/`);
      }

      if (!condoId && pathname !== "/sindico/novo-condominio") {
        router.push("/escolher-condominio");
      }
    }
  }, [userUid, router, condoId, user, pathname]);

  return children;
}

export default function AptManagerOnlyFeatureWrapper({
  children
}: Props): JSX.Element {
  return (
    <FetchAuthState>
      <AptManagerOnlyFeature>{children}</AptManagerOnlyFeature>
    </FetchAuthState>
  );
}
