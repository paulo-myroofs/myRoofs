import { formatToPhone } from "brazilian-values";
import Image from "next/image";
import { MdOutlineDelete } from "react-icons/md";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { ProductCardProps } from "./types";

const ProductCard = ({
  title,
  image,
  description,
  value,
  cardType,
  name,
  phone,
  apartment,
  onRemove
}: ProductCardProps) => {
  return (
    <Card className="relative w-full max-w-[310px] rounded-lg border-bordaPreta shadow-md sm:max-w-[350px]">
      <CardHeader className="relative flex flex-row items-center justify-center">
        <CardTitle className="w-fit text-2xl font-bold">{title}</CardTitle>
        {onRemove && (
          <button
            className="absolute right-6 cursor-pointer"
            onClick={onRemove}
          >
            <MdOutlineDelete className="bg-white" size={32} />
          </button>
        )}
      </CardHeader>
      <Separator className="mt-[-8px] bg-cinza-claro" />
      <div className="relative h-[200px] w-full overflow-hidden rounded-full">
        <Image
          src={image}
          sizes="310px"
          className="object-cover p-6"
          alt={`Imagem de ${title}`}
          fill
        />
      </div>
      <CardContent>
        <p className="text-sm font-medium text-bordaPreta">{description}</p>
        <div className="mt-4 flex items-center gap-4">
          <Button variant="outline" className="border-green-600 text-black">
            {value === 0 && "Gratuito"}
            {value === null && "A combinar"}
            {!!value && `R$ ${value}`}
          </Button>
          <Separator orientation="vertical" className="h-10 bg-cinza-claro" />
          <span className="text-green-600">{cardType}</span>
        </div>
      </CardContent>
      <CardFooter>
        <div className="h-[140px] w-full rounded-2xl border border-cinza-claro p-4">
          <p className="text-sm font-medium">Contato:</p>
          <div className="mt-2 flex items-center">
            <span>{name}</span>
          </div>
          <div className="mt-1 flex items-center">
            <span>{phone ? formatToPhone(phone) : ""}</span>
          </div>
          <div className="mt-1 flex items-center">
            <span>{apartment}</span>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
