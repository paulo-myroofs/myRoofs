"use client";

import * as React from "react";

import { ChevronDown, Check } from "lucide-react";

import Button from "@/components/atoms/Button/button";
import Input from "@/components/atoms/Input/input";
import Label from "@/components/atoms/Label/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Command, CommandGroup, CommandItem } from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { errorToast } from "@/hooks/useAppToast";
import { cn } from "@/lib/utils";
import { storageGet, storageSet } from "@/store/services/storage";

import { DropdownNotesProps } from "./types";

const DropdownNotes = ({ className, storageKey }: DropdownNotesProps) => {
  const options = storageGet<string[]>(storageKey) ?? [];

  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");
  const [checkedValues, setCheckedValues] = React.useState<string[]>([]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (options.includes(inputValue.toLocaleLowerCase())) {
      return errorToast("Tarefa já está na lista");
    }

    storageSet(storageKey, [...options, inputValue]);
    setInputValue("");
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSubmit(event as unknown as React.FormEvent);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          aria-expanded={open}
          className={cn(
            "relative w-full max-w-[350px] items-center rounded-full bg-[#202425] px-2 text-center text-[14px] font-normal text-white sm:w-[400px] sm:px-4 sm:text-[20px]",
            className
          )}
        >
          Notas
          <ChevronDown className="absolute right-8 h-6 w-6 justify-self-end" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="min-w-[350px] bg-[#F8F9FA] p-0 sm:min-w-[400px]">
        <Command>
          <CommandGroup className="max-h-[300px] overflow-y-auto">
            {options.map((option) => (
              <CommandItem
                key={option}
                value={option}
                onSelect={(currentValue) => {
                  setCheckedValues((prev) => [...prev, currentValue]);
                  setTimeout(() => {
                    storageSet(
                      storageKey,
                      options.filter((opt) => opt !== option)
                    );
                    setCheckedValues([]);
                  }, 800);
                }}
                className="flex items-center gap-x-4"
              >
                <Checkbox
                  checked={checkedValues.includes(option)}
                  onCheckedChange={() => null}
                  id={option}
                />
                <Label className="max-w-[350px] truncate sm:w-[400px]">
                  {option}
                </Label>
              </CommandItem>
            ))}

            <form
              className="mt-4 flex w-full items-center gap-x-2"
              onSubmit={handleSubmit}
              id="add-note"
            >
              <Input
                placeholder="Digite aqui"
                className="w-3/4"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <button
                form="add-note"
                className="flex w-1/4 items-center justify-center rounded-md border border-[#202425] bg-[#202425] py-2"
              >
                <Check className="text-white" />
              </button>
            </form>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default DropdownNotes;
