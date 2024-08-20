import { z } from "zod";

export default z.object({
  title: z
    .string({ required_error: "Insira um valor" })
    .min(1, "Insira um valor"),
  description: z
    .string({ required_error: "Insira uma descrição" })
    .min(1, "Insira uma descrição")
});
