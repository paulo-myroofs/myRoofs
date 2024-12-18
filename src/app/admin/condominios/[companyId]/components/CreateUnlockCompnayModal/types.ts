import { CondoEntity } from "@/common/entities/common/condo/condo";
import { CompanyEntity } from "@/common/entities/company";
import { TransitionModalProps } from "@/components/atoms/TransitionModal/types";

export interface CreateUnlockCompanyModalProps
  extends Pick<TransitionModalProps, "isOpen" | "onOpenChange"> {
  companyData: CompanyEntity | null;
  condoData: CondoEntity[];
}
