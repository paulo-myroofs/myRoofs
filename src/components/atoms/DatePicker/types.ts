import { SelectSingleEventHandler } from "react-day-picker";

export interface DatePickerProps {
  className?: string;
  date: Date;
  setDate: SelectSingleEventHandler;
}
