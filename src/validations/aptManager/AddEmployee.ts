import { z } from "zod";

import email from "@/common/validation/email";
import name from "@/common/validation/name";
import phone from "@/common/validation/phone";

const address = z.object({
  cep: z.string({ required_error: "CEP é obrigatório" }),
  state: z.string({ required_error: "Estado é obrigatório" }),
  city: z.string({ required_error: "Cidade é obrigatória" }),
  neighborhood: z.string({ required_error: "Bairro é obrigatório" }),
  address: z.string({ required_error: "Endereço é obrigatório" }),
  number: z.string({ required_error: "Número é obrigatório" }),
});

const validateCPF = (cpf: string): boolean => {
  // Remove caracteres não numéricos
  cpf = cpf.replace(/[^\d]+/g, "");

  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

  let soma = 0,
    resto;

  for (let i = 1; i <= 9; i++) soma += parseInt(cpf[i - 1]) * (11 - i);
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf[9])) return false;

  soma = 0;
  for (let i = 1; i <= 10; i++) soma += parseInt(cpf[i - 1]) * (12 - i);
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf[10])) return false;

  return true;
};

export default z.object({
  name,
  email,
  occupation: z
    .string({ required_error: "Insira um valor" })
    .min(1, "Insira um valor"),
  address,
  phone,
  cpf: z.string({ required_error: "CPF é obrigatório" }).refine(validateCPF, {
    message: "CPF inválido",
  }),
});
