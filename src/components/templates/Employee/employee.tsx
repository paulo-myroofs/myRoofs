"use client";

import { useEffect } from "react";

import { useRouter } from "next/navigation";

import useProfile from "@/hooks/queries/useProfile";
import useAuth from "@/hooks/useAuth";
import FetchAuthState from "@templates/FetchAuth/fetchAuth";

interface Props {
  children: JSX.Element;
}

function EmployeeOnlyFeature({ children }: Props): JSX.Element {
  const { userUid } = useAuth();

  const { data: user } = useProfile(userUid);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      if (user.role !== "employee") {
        router.push(`/login`);
      }
    }
  }, [userUid, router, user]);

  return children;
}

export default function EmployeeOnlyFeatureWrapper({
  children
}: Props): JSX.Element {
  return (
    <FetchAuthState>
      <EmployeeOnlyFeature>{children}</EmployeeOnlyFeature>
    </FetchAuthState>
  );
}
