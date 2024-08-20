import { z } from "zod";

import addressData from "@/common/validation/addressData";
import currency from "@/common/validation/currency";
import name from "@/common/validation/name";
import numberWithAux from "@/common/validation/numberWithAux";

export default z.object({
  name,
  cnpj: numberWithAux,
  addressData,
  setupValue: currency,
  monthValue: currency,
  finder: z.string().optional()
});
