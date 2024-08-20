import { z } from "zod";

export default z.object({
  date: z.date({ required_error: "Insira um valor" }),
  description: z
    .string({ required_error: "Insira um valor" })
    .min(1, "Insira um valor "),
  foundAt: z
    .string({ required_error: "Insira um valor" })
    .min(1, "Insira um valor ")
});
