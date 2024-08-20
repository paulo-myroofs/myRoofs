import { ProductCardProps } from "@/components/atoms/ProductCard/types";

export interface RenderProductCardWContactProps
  extends Omit<ProductCardProps, "name" | "phone" | "apartment"> {
  contactId: string;
  id: string;
}
