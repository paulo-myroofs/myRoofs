"use client";

import { useRouter } from "next/navigation";

import EmployeeFeatureWrapper from "@/components/templates/Employee/employee";
import Navbar from "@/containers/Navbar/navbar";
import { logout } from "@/store/services/auth";
import { storageDelete } from "@/store/services/storage";

const menuItems = [
  { label: "Visitas e Encomendas", href: "/funcionario/visitas-encomendas" },
  { label: "Reservas", href: "/funcionario/reservas" },
  { label: "Achados e Perdidos", href: "/funcionario/achados-perdidos" }
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const profileSelectOptions = [
    {
      label: "Perfil do funcionário",
      onClick: () => router.push("/funcionario/perfil")
    },
    {
      label: "Sair",
      onClick: () => {
        logout();
        storageDelete("condoId");
        router.push("/");
      }
    }
  ];
  return (
    <EmployeeFeatureWrapper>
      <main>
        <Navbar
          menuItems={menuItems}
          profileSelectOptions={profileSelectOptions}
        />
        <div className="my-32">{children}</div>
      </main>
    </EmployeeFeatureWrapper>
  );
}
