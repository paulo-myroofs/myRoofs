import { z } from "zod";

export default z.object({
  title: z
    .string({ required_error: "Insira um valor" })
    .min(1, "Insira um valor"),
  description: z
    .string({ required_error: "Insira uma descrição" })
    .min(1, "Insira uma descrição"),
  return: z
    .string({ required_error: "Insira uma resposta" })
    .min(1, "Insira uma resposta"),
  reaction: z
    .string({ required_error: "Selecione uma reação" })
    .min(1, "Selecione uma reação")
});
