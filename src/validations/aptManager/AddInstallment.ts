import { z } from "zod";

export default z.object({
  formation: z.string().min(1, "Insira um valor"),
  date: z.date({ required_error: "Insira uma data" })
});
