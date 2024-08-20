import { z } from "zod";

import AddCompanySchema from "@/validations/admin/AddCompany";

export type AddCompanyForm = z.infer<typeof AddCompanySchema>;
