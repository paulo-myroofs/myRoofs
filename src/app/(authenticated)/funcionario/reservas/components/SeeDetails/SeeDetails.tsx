import { twMerge } from "tailwind-merge";

import { inputClassName } from "@/app/contants";
import Label from "@/components/atoms/Label/label";
import TransitionModal from "@/components/atoms/TransitionModal/tempModal";
import { extractFilename } from "@/utils/extractFilename";

import { SeeDetailsProps } from "./types";

const SeeDetails = ({ isOpen, onOpenChange, bookingData }: SeeDetailsProps) => {
  const dataProps = [
    {
      label: "Comprovante de pagamento",
      file: bookingData?.paymentDoc
    },
    {
      label: "Lista de convidados",
      file: bookingData?.guestsDoc
    }
  ];

  return (
    <TransitionModal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title="Detalhes da reserva"
      description="Confira as informações necessárias para efetuar a solicitação"
      hasButtons={false}
      childrenClassName="space-y-4"
    >
      {dataProps.map((item) => (
        <div className="flex flex-col gap-1" key={item.label}>
          <Label>{item.label} </Label>

          <a
            href={item.file ?? "#"}
            target={item.file ? "_blank" : undefined}
            className={twMerge(
              "hover: relative flex h-[130px]  w-full items-center justify-center gap-1 overflow-hidden truncate rounded-sm border border-gray-300 px-3 text-base  outline-none transition-all ",
              inputClassName
            )}
          >
            <span className="w-[400px] truncate text-center hover:underline">
              {item.file ? (
                <span className="text-[#2A27CE]">
                  {extractFilename(item.file)}
                </span>
              ) : (
                "Sem arquivos"
              )}
            </span>
          </a>
        </div>
      ))}
    </TransitionModal>
  );
};

export default SeeDetails;
