import React from "react";

import { ResidentEntity } from "@/common/entities/resident";
import ProductCard from "@/components/atoms/ProductCard/productCard";
import useProfile from "@/hooks/queries/useProfile";

import { RenderProductCardWContactProps } from "./types";

const RenderProductCardWContact = ({
  contactId,
  ...partialProductCardProps
}: RenderProductCardWContactProps) => {
  const { data: personData } = useProfile<ResidentEntity>(contactId);

  if (!personData) return;
  return (
    <ProductCard
      {...partialProductCardProps}
      name={personData.name}
      phone={personData.phone ?? "Sem informação"}
      apartment={personData.housingName}
    />
  );
};

export default RenderProductCardWContact;
