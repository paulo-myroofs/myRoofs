"use client";

import React, { useEffect } from "react";

import { useRouter } from "next/navigation";

import LoadingComponent from "@/components/atoms/Loading/loading";
import useProfile from "@/hooks/queries/useProfile";
import useAuth from "@/hooks/useAuth";
import { storageGet } from "@/store/services/storage";
import FetchAuthState from "@templates/FetchAuth/fetchAuth";

interface Props {
  children: JSX.Element;
}

function PublicOnlyFeature({ children }: Props): JSX.Element {
  const condoId = storageGet<string>("condoId");
  const router = useRouter();
  const { userUid } = useAuth();
  const { data: user } = useProfile(userUid);

  useEffect(() => {
    if (userUid !== "undefined" && !!userUid && user) {
      if (user.role === "admin") {
        router.replace("/admin");
      }

      if (user.role === "aptManager") {
        if (!condoId) {
          router.replace("/escolher-condominio");
        } else {
          router.replace("/sindico");
        }
      }

      if (user.role === "employee") {
        router.replace("/funcionario/visitas-encomendas");
      }
    }
  }, [userUid, router, user, condoId]);

  if (userUid === "") {
    return children;
  }

  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <LoadingComponent />
    </div>
  );
  return children;
}

export default function PublicOnlyFeatureWrapper({
  children
}: Props): JSX.Element {
  return (
    <FetchAuthState>
      <PublicOnlyFeature>{children}</PublicOnlyFeature>
    </FetchAuthState>
  );
}
