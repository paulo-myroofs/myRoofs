"use client";

import { useRouter } from "next/navigation";

import Navbar from "@/containers/Navbar/navbar";
import { logout } from "@/store/services/auth";
import AdministratorOnlyFeature from "@templates/Administrator/administrator";

const menuItems = [
  { label: "Empresas", href: "/admin" },
  { label: "Histórico", href: "/admin/historico" }
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const profileSelectOptions = [
    {
      label: "Sair",
      onClick: () => {
        logout();
        router.push("/");
      }
    }
  ];

  return (
    <AdministratorOnlyFeature>
      <>
        <Navbar
          menuItems={menuItems}
          profileSelectOptions={profileSelectOptions}
        />
        <main className="my-32">{children}</main>
      </>
    </AdministratorOnlyFeature>
  );
}
