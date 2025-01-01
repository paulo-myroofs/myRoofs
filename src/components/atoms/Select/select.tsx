"use client";

import * as React from "react";

import { Check, ChevronDown } from "lucide-react";

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

import { SelectProps } from "./types";

import Button from "../Button/button";

const Select = ({
  options,
  className,
  placeholder = "Procure...",
  onChange,
  disabled = false,
  value,
  emptyPlaceholder = "Nenhum item encontrado."
}: SelectProps) => {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          disabled={disabled}
          aria-expanded={open}
          className={cn(
            "w-full items-center justify-between rounded-sm border-[#DEE2E6] bg-[#F8F9FA] px-2 text-[14px] font-normal hover:scale-100 hover:border-black disabled:opacity-50 disabled:hover:border-[#DEE2E6] sm:px-4 sm:text-base ",
            className
          )}
        >
          <span className="max-w-[150px] truncate">
            {value ? (
              options.find((option) => option.value === value)?.label
            ) : (
              <span className="text-black/50">{placeholder}</span>
            )}
          </span>
          <ChevronDown className="h-5 w-5" />
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
                disabled={option.disabled}
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

export default Select;
