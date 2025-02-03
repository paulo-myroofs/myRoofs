import { useState } from "react";

import { Command, CommandGroup, CommandItem } from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";

import { ProfileSelectProps } from "./types";

const User = ({ color = "black" }: { color: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="40"
      height="40"
      viewBox="0 0 48 48"
      fill="none"
    >
      <path
        d="M9.24 36.24C11.28 34.68 13.56 33.45 16.08 32.55C18.6 31.65 21.24 31.2 24 31.2C26.76 31.2 29.4 31.65 31.92 32.55C34.44 33.45 36.72 34.68 38.76 36.24C40.16 34.6 41.25 32.74 42.03 30.66C42.81 28.58 43.2 26.36 43.2 24C43.2 18.68 41.33 14.15 37.59 10.41C33.85 6.67 29.32 4.8 24 4.8C18.68 4.8 14.15 6.67 10.41 10.41C6.67 14.15 4.8 18.68 4.8 24C4.8 26.36 5.19 28.58 5.97 30.66C6.75 32.74 7.84 34.6 9.24 36.24ZM24 26.4C21.64 26.4 19.65 25.59 18.03 23.97C16.41 22.35 15.6 20.36 15.6 18C15.6 15.64 16.41 13.65 18.03 12.03C19.65 10.41 21.64 9.6 24 9.6C26.36 9.6 28.35 10.41 29.97 12.03C31.59 13.65 32.4 15.64 32.4 18C32.4 20.36 31.59 22.35 29.97 23.97C28.35 25.59 26.36 26.4 24 26.4ZM24 48C20.68 48 17.56 47.37 14.64 46.11C11.72 44.85 9.18 43.14 7.02 40.98C4.86 38.82 3.15 36.28 1.89 33.36C0.63 30.44 0 27.32 0 24C0 20.68 0.63 17.56 1.89 14.64C3.15 11.72 4.86 9.18 7.02 7.02C9.18 4.86 11.72 3.15 14.64 1.89C17.56 0.63 20.68 0 24 0C27.32 0 30.44 0.63 33.36 1.89C36.28 3.15 38.82 4.86 40.98 7.02C43.14 9.18 44.85 11.72 46.11 14.64C47.37 17.56 48 20.68 48 24C48 27.32 47.37 30.44 46.11 33.36C44.85 36.28 43.14 38.82 40.98 40.98C38.82 43.14 36.28 44.85 33.36 46.11C30.44 47.37 27.32 48 24 48ZM24 43.2C26.12 43.2 28.12 42.89 30 42.27C31.88 41.65 33.6 40.76 35.16 39.6C33.6 38.44 31.88 37.55 30 36.93C28.12 36.31 26.12 36 24 36C21.88 36 19.88 36.31 18 36.93C16.12 37.55 14.4 38.44 12.84 39.6C14.4 40.76 16.12 41.65 18 42.27C19.88 42.89 21.88 43.2 24 43.2ZM24 21.6C25.04 21.6 25.9 21.26 26.58 20.58C27.26 19.9 27.6 19.04 27.6 18C27.6 16.96 27.26 16.1 26.58 15.42C25.9 14.74 25.04 14.4 24 14.4C22.96 14.4 22.1 14.74 21.42 15.42C20.74 16.1 20.4 16.96 20.4 18C20.4 19.04 20.74 19.9 21.42 20.58C22.1 21.26 22.96 21.6 24 21.6Z"
        fill={color}
      />
    </svg>
  );
};

const ProfileSelect = ({ options }: ProfileSelectProps) => {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="cursor-pointer transition-all hover:scale-110"
        >
          <User color="#00FF5F" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-[180px] bg-[#F8F9FA] p-0">
        <Command>
          <CommandGroup className="max-h-[300px] overflow-y-auto">
            {options.map((option) => (
              <CommandItem
                className="cursor-pointer transition-all hover:opacity-70"
                key={option.label}
                value={option.label}
                onSelect={() => {
                  option.onClick();
                  setOpen(false);
                }}
              >
                {option.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default ProfileSelect;
