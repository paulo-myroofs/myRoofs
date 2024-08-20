export interface ProductCardProps {
  title: string;
  image: string;
  description: string;
  value: number | null; // a combinar | grátis | number
  cardType: "Produto" | "Serviço";
  name: string;
  phone: string;
  apartment: string;
  onRemove?: () => void;
}
