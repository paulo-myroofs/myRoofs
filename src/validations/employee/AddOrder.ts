import { z } from "zod";

export default z.object({
  date: z.date({ required_error: "Insira um valor" }),
  formation: z
    .string({ required_error: "Insira um valor" })
    .min(1, "Insira um valor "),
  apartment: z
    .string({ required_error: "Insira um valor" })
    .min(1, "Insira um valor "),
  deliverTo: z
    .string({ required_error: "Insira um valor" })
    .min(1, "Insira um valor "),
  orderType: z
    .string({ required_error: "Insira um valor" })
    .min(1, "Insira um valor"),
  deliverBy: z
    .string({ required_error: "Insira um valor" })
    .min(1, "Insira um valor")
});
