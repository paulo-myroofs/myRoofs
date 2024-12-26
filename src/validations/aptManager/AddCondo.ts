import { z } from "zod";

import addressData from "@/common/validation/addressData";
import name from "@/common/validation/name";
import number from "@/common/validation/number";
import numberWithAux from "@/common/validation/numberWithAux";
import phone from "@/common/validation/phone";

const SignInFormSchema = z.object({
  name,
  cnpj: numberWithAux,
  addressData,
  phone,

  floorsQty: number,
  garageSpacesQty: number
});

export default SignInFormSchema;
