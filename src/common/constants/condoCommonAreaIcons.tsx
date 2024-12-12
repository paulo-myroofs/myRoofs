import { ReactNode } from "react";

import Cake from "@/components/atoms/Icons/Cake";
import Grill from "@/components/atoms/Icons/Grill";
import Gym from "@/components/atoms/Icons/Gym";
import Poll from "@/components/atoms/Icons/Pool";
import ToyLibrary from "@/components/atoms/Icons/ToyLibrary";
import Playground from "@/components/atoms/Icons/Playground";
import GameRoom from "@/components/atoms/Icons/GameRoom";
import PetSpace from "@/components/atoms/Icons/PetSpace";
import Block from "@/components/atoms/Icons/Block";
import Cinema from "@/components/atoms/Icons/Cinema";
import Gourmet from "@/components/atoms/Icons/GourmetSpace";
import StudyRoom from "@/components/atoms/Icons/StudyRoom";
import MeetingRoom from "@/components/atoms/Icons/MeetingRoom";

import { CondoCommonArea } from "../entities/common/condo/condoCommonAreas";

const condoCommonAreaIcons: {
  type: CondoCommonArea["type"];
  icon: (color?: string) => ReactNode;
  name: string; // Add name property
}[] = [
  {
    type: "cake",
    icon: (color) => <Cake color={color} />,
    name: "Salão de festas",
  },
  { type: "pool", icon: (color) => <Poll color={color} />, name: "Piscina" },
  { type: "gym", icon: (color) => <Gym color={color} />, name: "Academia" },
  {
    type: "grill",
    icon: (color) => <Grill color={color} />,
    name: "Churrasqueira",
  },
  {
    type: "playground",
    icon: (color) => <Playground color={color} />,
    name: "Playground",
  },
  { type: "block", icon: (color) => <Block color={color} />, name: "Quadra" },
  {
    type: "meetingRoom",
    icon: (color) => <MeetingRoom color={color} />,
    name: "Sala de reunião",
  },
  {
    type: "gameRoom",
    icon: (color) => <GameRoom color={color} />,
    name: "Sala de jogos",
  },
  {
    type: "toyLibrary",
    icon: (color) => <ToyLibrary color={color} />,
    name: "Brinquedoteca",
  },
  {
    type: "cinema",
    icon: (color) => <Cinema color={color} />,
    name: "Sala de cinema",
  },
  {
    type: "petSpace",
    icon: (color) => <PetSpace color={color} />,
    name: "Espaço pet",
  },
  {
    type: "gourmetSpace",
    icon: (color) => <Gourmet color={color} />,
    name: "Espaço gourmet",
  },
  {
    type: "studyRoom",
    icon: (color) => <StudyRoom color={color} />,
    name: "Sala de estudos",
  },
];

export default condoCommonAreaIcons;
