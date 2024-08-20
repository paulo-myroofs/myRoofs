import { ReactNode } from "react";

import Cake from "@/components/atoms/Icons/Cake";
import Grill from "@/components/atoms/Icons/Grill";
import Gym from "@/components/atoms/Icons/Gym";
import Poll from "@/components/atoms/Icons/Pool";

import { CondoCommonArea } from "../entities/common/condo/condoCommonAreas";

const condoCommonAreaIcons: {
  type: CondoCommonArea["type"];
  icon: (color?: string) => ReactNode;
}[] = [
  { type: "gym", icon: (color) => <Gym color={color} /> },
  { type: "pool", icon: (color) => <Poll color={color} /> },
  { type: "grill", icon: (color) => <Grill color={color} /> },
  { type: "partyRoom", icon: (color) => <Cake color={color} /> }
];

export default condoCommonAreaIcons;
