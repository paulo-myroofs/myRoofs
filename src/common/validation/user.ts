import { z } from "zod";

import { validateCPF } from "@/validations/aptManager/AddEmployee";

import numberWithAux from "./numberWithAux";

const userData = z.object({
  name: z.string().min(1, "Insira um valor"),
  cpf: z.string({ required_error: "CPF é obrigatório" }).refine(validateCPF, {
    message: "CPF inválido"
  }),
  rg: numberWithAux,
  emitter: z.string().min(1, "Insira um valor"),
  profession: z.string().min(1, "Insira um valor"),
  adminRole: z.string().min(1, "Insira um valor"),
  // status: z.string(),
  maritalStatus: z.string().min(1, "Insira um valor")
});

export default userData;
