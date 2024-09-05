import { CondoEntity } from "@/common/entities/common/condo/condo";

export interface AddEditCondoFormProps {
  companyId: string;
  aptManagersIds: string[];
  condoData?: CondoEntity; // in case of read only or edit
  readOnly?: boolean;
  setEditFalse?: () => void; // in case of read only or edit
}
