import { ProfileSelectProps } from "./components/ProfileSelector/types";

export interface MenuItems {
  label: string;
  href: string;
}

export interface ResponsiveMenuProps {
  menuItems: MenuItems[];
  onCloseMenu: () => void;
  profileSelectOptions?: ProfileSelectProps["options"];
}

export interface NavbarProps {
  menuItems: MenuItems[];
  profileSelectOptions?: ProfileSelectProps["options"];
  gap?: string;
}
