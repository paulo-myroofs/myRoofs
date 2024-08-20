import { z } from "zod";

export default z.object({
  category: z
    .string()
    .min(1, "Insira um valor")
    .transform((item) => item.trim()),
  name: z
    .string({ required_error: "Selecione um morador" })
    .min(1, "Selecione um morador"),
  formation: z.string().min(1, "Insira um valor"),
  apartment: z.string().min(1, "Insira um valor"),
  status: z
    .string({ required_error: "Insira um status" })
    .min(1, "Insira um status"),
  date: z.date({ required_error: "Insira uma data" })
});
