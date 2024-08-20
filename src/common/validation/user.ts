import { z } from "zod";

import numberWithAux from "./numberWithAux";

const userData = z.object({
  name: z.string().min(1, "Insira um valor"),
  cpf: numberWithAux,
  rg: numberWithAux,
  emitter: z.string().min(1, "Insira um valor"),
  profession: z.string().min(1, "Insira um valor"),
  maritalStatus: z.string().min(1, "Insira um valor")
});

export default userData;
