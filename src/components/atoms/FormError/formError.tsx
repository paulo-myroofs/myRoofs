import { FormErrorProps } from "./types";

const FormErrorLabel = ({ children }: FormErrorProps) => {
  return <p className="text-xs text-red-600">{children}</p>;
};

export default FormErrorLabel;
