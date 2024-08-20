import { CondoCommonArea } from "@/common/entities/common/condo/condoCommonAreas";

export interface IconsSelectorProps {
  activeIcon: CondoCommonArea["type"] | undefined;
  setActiveIcon: (value: IconsSelectorProps["activeIcon"]) => void;
}
