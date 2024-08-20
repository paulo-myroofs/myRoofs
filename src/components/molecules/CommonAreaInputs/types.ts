import { Dispatch, SetStateAction } from "react";

import { CondoCommonArea } from "@/common/entities/common/condo/condoCommonAreas";

export interface CommonAreasInputsProps {
  readOnly?: boolean;
  commonAreas: CondoCommonArea[] | undefined;
  setCommonAreas: Dispatch<
    SetStateAction<CommonAreasInputsProps["commonAreas"]>
  >;
}
