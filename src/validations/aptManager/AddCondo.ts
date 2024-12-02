import { z } from "zod";

import name from "@/common/validation/name";
import number from "@/common/validation/number";
import numberWithAux from "@/common/validation/numberWithAux";
import phone from "@/common/validation/phone";

const SignInFormSchema = z.object({
  name,
  cnpj: numberWithAux,
  address: z.string().min(1, "Insira um valor"),
  phone,
  floorsQty: number,
  garageSpacesQty: number
});

export default SignInFormSchema;
