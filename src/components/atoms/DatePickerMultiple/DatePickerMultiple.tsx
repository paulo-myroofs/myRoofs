"use client";

import React from "react";

import { Calendar } from "@/components/ui/calendar-multiple";

interface DatePickerMultipleProps {
  dates: Date[] | undefined;
  setDates: (dates: DatePickerMultipleProps["dates"]) => void;
}

export function DatePickerMultiple({
  dates,
  setDates
}: DatePickerMultipleProps) {
  return (
    <div className="flex h-full w-full flex-shrink-0 items-start justify-between gap-5">
      <Calendar
        mode="multiple"
        selected={dates}
        onSelect={(days) => setDates(days)}
        initialFocus
      />
      <div className="flex max-h-[315px] flex-wrap gap-4 overflow-y-auto">
        {" "}
        {dates?.map((item) => (
          <p
            key={item.toLocaleDateString()}
            className="h-fit flex-shrink-0 rounded-full border border-[#DEE2E6] bg-[#F8F9FA] px-4 py-2"
          >
            {" "}
            {item.toLocaleDateString()}{" "}
          </p>
        ))}{" "}
      </div>
    </div>
  );
}
