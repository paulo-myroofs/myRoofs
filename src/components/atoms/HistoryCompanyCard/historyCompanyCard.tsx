import Image from "next/image";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { HistoryCompanyCardProps } from "./types";

const HistoryCompanyCard = ({
  title,
  startDate,
  endDate,
  image
}: HistoryCompanyCardProps) => {
  return (
    <Card className="border-bordaPreta w-64 font-bold xl:w-80">
      <CardHeader>
        <Image
          src={image}
          alt={`Imagem de ${title}`}
          width={420}
          height={200}
          style={{ borderRadius: "0.5rem", border: "1px solid #000" }}
        />
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent className="mt-[-1.2rem]">
        <a className="font-regular cursor-pointer underline">
          {startDate} - {endDate}
        </a>
      </CardContent>
    </Card>
  );
};

export default HistoryCompanyCard;
