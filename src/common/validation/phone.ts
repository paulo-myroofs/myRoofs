import { z } from "zod";

export default z
  .string({ required_error: "Insira seu telefone" })
  .regex(
    /^\(\d{2}\) \d{4,5}-\d{4}$/,
    "O telefone deve estar no formato (99) 99999-9999"
  )
  .transform((value) => value.replace(/\s+/g, " ").trim());
