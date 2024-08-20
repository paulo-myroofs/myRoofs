import {
  Control,
  FieldErrors,
  FieldValues,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch
} from "react-hook-form";

export interface AptManagerInputsProps<T extends FieldValues> {
  watch: UseFormWatch<T>;
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
  control: Control<T>;
  setValue: UseFormSetValue<T>;
  hideEmail?: boolean;
}
