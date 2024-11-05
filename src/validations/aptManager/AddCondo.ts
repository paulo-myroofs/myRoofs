import { z } from "zod";

import name from "@/common/validation/name";
import number from "@/common/validation/number";
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

const SignInFormSchema = z.object({
  name,
  cnpj: numberWithAux,
  address,
  phone,
  housingName: z.string().min(1, "Insira um valor"),
  floorsQty: number,
  garageSpacesQty: number
});

export default SignInFormSchema;
