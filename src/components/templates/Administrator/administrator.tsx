"use client";

import React, { useEffect } from "react";

import { useRouter } from "next/navigation";

import FetchAuthState from "@/components/templates/FetchAuth/fetchAuth";
import useProfile from "@/hooks/queries/useProfile";
import useAuth from "@/hooks/useAuth";

interface Props {
  children: JSX.Element;
}

function AdministratorOnlyFeature({ children }: Props): JSX.Element {
  const { userUid } = useAuth();
  const { data: user } = useProfile(userUid);
  const router = useRouter();

  useEffect(() => {
    if (user && !user.role?.includes("admin")) {
      router.push(`/`);
    }
  }, [router, user]);

  if (!user || !user.role?.includes("admin")) {
    return (
      <main className="flex h-screen items-center justify-center">
        <h1>Verificando autenticidade...</h1>
      </main>
    );
  }
  return children;
}

export default function AdministratorOnlyFeatureWrapper({
  children
}: Props): JSX.Element {
  return (
    <FetchAuthState>
      <AdministratorOnlyFeature>{children}</AdministratorOnlyFeature>
    </FetchAuthState>
  );
}
