import { z } from "zod";

import email from "@/common/validation/email";

export default z.object({
  name: z
    .string({ required_error: "Selecione um morador" })
    .min(1, "Selecione um morador"),
  formation: z.string().min(1, "Insira um valor"),
  apartment: z.string().min(1, "Insira um valor"),
  email
});
