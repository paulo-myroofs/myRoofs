import { z } from "zod";

import email from "@/common/validation/email";
import name from "@/common/validation/name";
import numberWithAux from "@/common/validation/numberWithAux";
import phone from "@/common/validation/phone";

const address = z.object({
  cep: z.string({ required_error: "CEP é obrigatório" }),
  state: z.string({ required_error: "Estado é obrigatório" }),
  city: z.string({ required_error: "Cidade é obrigatória" }),
  neighborhood: z.string({ required_error: "Bairro é obrigatório" }),
  address: z.string({ required_error: "Endereço é obrigatório" }),
  number: z.string({ required_error: "Número é obrigatório" })
});

export default z.object({
  name,
  email,
  occupation: z
    .string({ required_error: "Insira um valor" })
    .min(1, "Insira um valor"),
  address,
  phone,
  cpf: numberWithAux
});
