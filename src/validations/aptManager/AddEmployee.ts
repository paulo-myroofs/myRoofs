import { z } from "zod";

import email from "@/common/validation/email";
import name from "@/common/validation/name";
import numberWithAux from "@/common/validation/numberWithAux";
import phone from "@/common/validation/phone";

export default z.object({
  name,
  email,
  occupation: z
    .string({ required_error: "Insira um valor" })
    .min(1, "Insira um valor"),
  address: z
    .string({ required_error: "Insira um valor" })
    .min(1, "Insira um valor"),
  phone,
  cpf: numberWithAux
});
