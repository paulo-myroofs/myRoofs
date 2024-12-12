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
}[] = [
  { type: "gym", icon: (color) => <Gym color={color} /> },
  { type: "pool", icon: (color) => <Poll color={color} /> },
  { type: "grill", icon: (color) => <Grill color={color} /> },
  { type: "partyRoom", icon: (color) => <Cake color={color} /> },
  { type: "block", icon: (color) => <Block color={color} /> },
  { type: "cake", icon: (color) => <Cake color={color} /> },
  { type: "cinema", icon: (color) => <Cinema color={color} /> },
  { type: "gameRoom", icon: (color) => <GameRoom color={color} /> },
  { type: "gourmetSpace", icon: (color) => <Gourmet color={color} /> },
  { type: "meetingRoom", icon: (color) => <MeetingRoom color={color} /> },
  { type: "petSpace", icon: (color) => <PetSpace color={color} /> },
  { type: "playground", icon: (color) => <Playground color={color} /> },
  { type: "studyRoom", icon: (color) => <StudyRoom color={color} /> },
  { type: "toyLibrary", icon: (color) => <ToyLibrary color={color} /> },
];

export default condoCommonAreaIcons;
