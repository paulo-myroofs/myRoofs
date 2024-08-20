import { z } from "zod";

import name from "@/common/validation/name";

export default z.object({
  name,
  local: z.string().min(3, "Insira um valor"),
  daysHours: z.string().min(1, "Insira um valor"),
  professionalName: z.string().optional()
});
