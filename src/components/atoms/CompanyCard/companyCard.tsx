import Image from "next/image";
import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { CompanyCardProps } from "./types";

const CompanyCard = ({ title, image, href }: CompanyCardProps) => {
  return (
    <Card className="border-bordaPreta w-full font-bold sm:w-80">
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
      <CardContent className="mt-[-1.2rem] flex">
        <Link
          href={href}
          className="font-regular ml-auto cursor-pointer underline"
        >
          Ver Mais
        </Link>
      </CardContent>
    </Card>
  );
};

export default CompanyCard;
