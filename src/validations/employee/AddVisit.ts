import { z } from "zod";

import name from "@/common/validation/name";
import phone from "@/common/validation/phone";

export default z.object({
  name,
  phone,
  category: z.enum(["visita", "serviço"], {
    required_error: "Insira um valor válido"
  }),
  date: z.date({ required_error: "Insira um valor" }),
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
