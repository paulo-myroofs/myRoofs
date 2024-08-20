import Image from "next/image";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useCompany from "@/hooks/queries/companies/useCompany";
import { timestampToDate } from "@/utils/timestampToDate";

import { HistoricCondoCardProps } from "./types";

const HistoricCondoCard = ({
  title,
  image,
  companyId,
  endedAt,
  createdAt
}: HistoricCondoCardProps) => {
  const { data: company } = useCompany(companyId);
  const isCompanyActive = !company?.endedAt;

  return (
    <Card className="w-full border-bordaPreta font-bold sm:w-80">
      <CardHeader>
        <Image
          src={image}
          alt={`Imagem de ${title}`}
          width={520}
          height={200}
          className="h-[160px] object-cover"
          style={{ borderRadius: "0.5rem", border: "1px solid #000" }}
        />
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent className="mt-[-1.2rem] flex flex-col gap-2">
        <p className="flex gap-x-2 font-regular ">{`${company?.name} (${isCompanyActive ? "Ativa" : "Encerrada"})`}</p>
        <p className="flex gap-x-2 font-regular ">
          <span>{timestampToDate(createdAt).toLocaleDateString()}</span>
          <span>-</span>
          <span>{timestampToDate(endedAt).toLocaleDateString()}</span>
        </p>
      </CardContent>
    </Card>
  );
};

export default HistoricCondoCard;
