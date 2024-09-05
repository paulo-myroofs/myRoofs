import { CondoAssembly } from "@/common/entities/notices/condoAssemblies";
import { TransitionModalProps } from "@/components/atoms/TransitionModal/types";

export interface CreateAssemblyModalProps
  extends Pick<TransitionModalProps, "isOpen" | "onOpenChange"> {
  assemblyData?: CondoAssembly;
  readOnly?: boolean;
}
