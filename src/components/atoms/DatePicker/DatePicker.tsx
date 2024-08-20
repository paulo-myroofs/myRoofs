"use client";

import * as React from "react";

import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

import { DatePickerProps } from "./types";

export function DatePicker({ className, date, setDate }: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          className={cn(
            "h-11 w-full justify-start gap-1 rounded-sm border border-[#DEE2E6] bg-[#F8F9FA] px-2 text-[14px] font-normal outline-none focus:border-black sm:px-4 sm:text-base",
            className
          )}
        >
          {date ? (
            format(date, "dd/MM/yyyy")
          ) : (
            <span className="text-black/50">00/00/0000</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto bg-[#F8F9FA] p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
