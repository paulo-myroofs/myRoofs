"use client";

import { useRouter } from "next/navigation";

import AptManagerOnlyFeatureWrapper from "@/components/templates/AptManager/aptManager";
import Navbar from "@/containers/Navbar/navbar";
import { logout } from "@/store/services/auth";
import { storageDelete } from "@/store/services/storage";

const menuItems = [
  { label: "Notas & Comunicados", href: "/sindico" },
  { label: "Histórico", href: "/sindico/historico" },
  { label: "Cadastros", href: "/sindico/cadastros" },
  { label: "Finanças", href: "/sindico/financas" },
  { label: "Produtos e Serviços", href: "/sindico/produtos-servicos" }
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const profileSelectOptions = [
    {
      label: "Perfil do condomínio",
      onClick: () => router.push("/sindico/condominio")
    },
    {
      label: "Meus condomínios",
      onClick: () => router.push("/escolher-condominio")
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
    //<AptManagerOnlyFeatureWrapper>
      <main>
        <Navbar
          menuItems={menuItems}
          profileSelectOptions={profileSelectOptions}
          gap={'sm'}
        />
        <div className="my-32">{children}</div>
      </main>
   // </AptManagerOnlyFeatureWrapper>
  );
}
