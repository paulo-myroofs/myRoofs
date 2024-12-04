import { useState } from "react";

import Image from "next/image";

import CreateUnlockCompanyModal from "@/app/admin/condominios/[companyId]/components/CreateUnlockCompnayModal/CreateUnlockCompanyModal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { BlockedCompanyCardProps } from "./types";

const BlockedCompanyCard = ({ company }: BlockedCompanyCardProps) => {
  const [unlockModalOpen, setUnlockModalOpen] = useState(false);
  return (
    <>
      <Card
        onClick={() => setUnlockModalOpen(true)}
        className="w-full border-bordaPreta font-bold sm:w-80"
      >
        <CardHeader>
          <Image
            src={company.image}
            alt={`Imagem de ${company.name}`}
            width={520}
            height={200}
            className="h-[160px] object-cover"
            style={{ borderRadius: "0.5rem", border: "1px solid #000" }}
          />
          <CardTitle className="text-xl">{company.name}</CardTitle>
        </CardHeader>
        <CardContent className="mt-[-1.2rem] flex"></CardContent>
      </Card>
      <CreateUnlockCompanyModal
        isOpen={unlockModalOpen}
        onOpenChange={setUnlockModalOpen}
        companyData={company}
      ></CreateUnlockCompanyModal>
    </>
  );
};

export default BlockedCompanyCard;
