import { z } from "zod";

import number from "./number";
import numberWithAux from "./numberWithAux";

const addressData = z.object({
  address: z.string().min(1, "Insira um valor"),
  neighborhood: z.string().min(1, "Insira um valor"),
  state: z
    .string({ required_error: "Insira um valor" })
    .min(1, "Insira um valor"),
  number,
  cep: numberWithAux,
  city: z.string().min(1, "Insira um valor")
});

export default addressData;
