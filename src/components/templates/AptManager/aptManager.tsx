"use client";

import { useEffect } from "react";

import { usePathname, useRouter } from "next/navigation";

import useProfile from "@/hooks/queries/useProfile";
import useAuth from "@/hooks/useAuth";
import { storageGet } from "@/store/services/storage";
import FetchAuthState from "@templates/FetchAuth/fetchAuth";

interface Props {
  children: JSX.Element;
}

function AptManagerOnlyFeature({ children }: Props): JSX.Element {
  const { userUid } = useAuth();
  const pathname = usePathname();
  const condoId = storageGet<string>("condoId");

  const { data: user } = useProfile(userUid);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      if (user.role !== "aptManager") {
        router.push(`/login`);
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
