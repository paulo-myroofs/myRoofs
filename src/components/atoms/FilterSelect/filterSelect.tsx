"use client";

import * as React from "react";

import { Check, ChevronDown } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

import { FilterSelectProps } from "./types";

const FilterSelect = ({
  options,
  className,
  placeholder = "Procure...",
  onChange,
  value,
  filterName,
  emptyPlaceholder = "Nenhum item encontrado."
}: FilterSelectProps) => {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          aria-expanded={open}
          className={cn(
            "rounded-[8px] border border-black p-3 text-[14px] font-normal hover:scale-[100%] hover:border-black sm:p-[18px] sm:text-base",
            className
          )}
        >
          {value ? (
            <div className="flex items-center gap-x-2 sm:gap-x-[18px]">
              {options.find((option) => option.value === value)?.label}
              <ChevronDown className="h-5 w-5" />
            </div>
          ) : (
            <div className="flex items-center gap-x-2 sm:gap-x-[18px]">
              <Image
                src={"/icons/filter.svg"}
                width={20}
                height={20}
                alt="Icon de filtro"
              />{" "}
              <span>{filterName}</span>
            </div>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="min-w-[200px] bg-[#F8F9FA] p-0 ">
        <Command>
          <CommandInput placeholder={placeholder} className="h-9" />
          <CommandEmpty>{emptyPlaceholder}</CommandEmpty>
          <CommandGroup className="max-h-[300px] overflow-y-auto">
            {options.map((option) => (
              <CommandItem
                key={option.value}
                value={option.value}
                onSelect={(currentValue) => {
                  if (onChange) {
                    onChange(currentValue === value ? "" : option.value);
                  }
                  setOpen(false);
                }}
              >
                {option.label}
                <Check
                  className={cn(
                    "ml-auto h-4 w-4",
                    value === option.value ? "opacity-100" : "opacity-0"
                  )}
                />
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default FilterSelect;
