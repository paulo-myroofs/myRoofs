import { z } from "zod";

export default z.object({
  formation: z
    .string({ required_error: "Insira um valor" })
    .min(1, "Insira um valor "),
  apartment: z
    .string({ required_error: "Insira um valor" })
    .min(1, "Insira um valor "),
  resident: z
    .string({ required_error: "Insira um valor" })
    .min(1, "Insira um valor ")
});
