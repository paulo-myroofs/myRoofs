"use client";
import React, { useEffect, useRef, useState } from "react";

import { X } from "lucide-react";
import { twMerge } from "tailwind-merge";

import { inputClassName } from "@/app/contants";
import { CondoEntity } from "@/common/entities/common/condo/condo";
import Button from "@/components/atoms/Button/button";
import Label from "@/components/atoms/Label/label";
import useCondo from "@/hooks/queries/condos/useCondo";
import { errorToast } from "@/hooks/useAppToast";
import { cn } from "@/lib/utils";
import { queryClient } from "@/store/providers/queryClient";
import { updateFirestoreDoc } from "@/store/services";
import { deleteFile, uploadFile } from "@/store/services/firebaseStorage";
import { storageGet } from "@/store/services/storage";
import { extractFilename } from "@/utils/extractFilename";

import { InputsDataType } from "./types";

const DocsCondoSection = () => {
  const condoId = storageGet<string>("condoId");
  const { data: condo } = useCondo(condoId as string);
  const [inputsData, setInputsData] = useState<InputsDataType>();
  const [loading, setLoading] = useState(false);
  const inputUploadConventions = useRef<HTMLInputElement | null>(null);
  const inputUploadRegulations = useRef<HTMLInputElement | null>(null);

  const [isEdit, setIsEdit] = useState(false);

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    key: keyof InputsDataType
  ) => {
    if (!inputsData) return;
    const file = e.target.files?.[0];
    if (file) {
      setInputsData((prev) => (prev ? { ...prev, [key]: file } : undefined));
    }
  };

  const finalData: {
    label: string;
    ref: React.MutableRefObject<HTMLInputElement | null>;
    key: keyof InputsDataType;
  }[] = [
    {
      label: "Convenção do condomínio",
      ref: inputUploadConventions,
      key: "conventions"
    },
    {
      label: "Regimento do condomínio",
      ref: inputUploadRegulations,
      key: "regulations"
    }
  ];

  const handleCancel = () => {
    if (!condo) return;

    setInputsData({
      conventions: condo.conventionDoc ?? null,
      regulations: condo.regulationsDoc ?? null
    });
    setIsEdit(false);
  };

  const handleSave = async () => {
    setLoading(true);

    let conventionDocUrl = null;
    let regulationsDocUrl = null;

    if (
      typeof inputsData?.conventions !== "string" &&
      !!inputsData?.conventions
    ) {
      const { fileUrl: url, error: errorUpload } = await uploadFile(
        inputsData?.conventions as File
      );

      if (errorUpload || !url) {
        errorToast(
          "Não foi possível fazer upload de documento de convenção, entrar em contato."
        );
      }

      conventionDocUrl = url;
      if (condo?.conventionDoc) {
        await deleteFile(condo.conventionDoc);
      }
    }
    if (condo?.conventionDoc && !inputsData?.conventions) {
      await deleteFile(condo.conventionDoc);
    }

    if (inputsData?.regulations) {
      const { fileUrl: url, error: errorUpload } = await uploadFile(
        inputsData?.regulations as File
      );

      if (errorUpload || !url) {
        errorToast(
          "Não foi possível fazer upload de documento de convenção, entrar em contato."
        );
      }

      regulationsDocUrl = url;
      if (condo?.regulationsDoc) {
        await deleteFile(condo.regulationsDoc);
      }
    }

    if (condo?.regulationsDoc && !inputsData?.regulations) {
      await deleteFile(condo.conventionDoc);
    }

    await updateFirestoreDoc<Omit<CondoEntity, "id">>({
      documentPath: `condominium/${condoId}`,
      data: {
        conventionDoc: conventionDocUrl,
        regulationsDoc: regulationsDocUrl
      }
    });
    setIsEdit(false);
    setLoading(false);
    queryClient.invalidateQueries(["condominium"]);
  };

  useEffect(() => {
    if (condo && !inputsData) {
      setInputsData({
        conventions: condo.conventionDoc ?? null,
        regulations: condo.regulationsDoc ?? null
      });
    }
  }, [condo, inputsData]);

  return (
    <section className="mx-auto w-full max-w-[1300px] space-y-8">
      <div className={cn("mt-4 space-y-4", !isEdit && "opacity-60")}>
        {finalData.map((item) => {
          const inputData = inputsData ? inputsData[item.key] : undefined;
          return (
            <div className="relative flex flex-col gap-1" key={item.key}>
              {isEdit && !!inputData && (
                <X
                  className="absolute top-10 right-5 z-20 cursor-pointer opacity-100 transition-all hover:scale-110"
                  onClick={(e) => {
                    e.stopPropagation();
                    setInputsData((prev) =>
                      prev ? { ...prev, [item.key]: null } : undefined
                    );
                  }}
                />
              )}
              <Label>{item.label} </Label>
              <input
                disabled={!isEdit}
                type="file"
                ref={item.ref}
                accept=".pdf, .doc, .docx, .xls, .xlsx, .ppt, .pptx, .txt, .csv, .rtf, .odt"
                className="hidden"
                onChange={(e) => handleFileChange(e, item.key)}
              />
              <button
                type="button"
                onClick={() => item.ref?.current?.click()}
                className={twMerge(
                  "relative flex h-[130px] w-full items-center justify-center gap-1 overflow-hidden rounded-sm border border-gray-300 px-3 text-sm text-black/50 transition-all outline-none hover:opacity-60",
                  inputClassName
                )}
              >
                {inputData ? (
                  <a
                    href={
                      typeof inputData === "string"
                        ? inputData
                        : URL.createObjectURL(inputData)
                    }
                    target="_blank"
                    className="text-[16px] text-black"
                  >
                    {typeof inputData === "string"
                      ? extractFilename(inputData)
                      : inputData.name}
                  </a>
                ) : (
                  <strong>Clique para fazer upload</strong>
                )}
              </button>
            </div>
          );
        })}
      </div>

      {!isEdit ? (
        <Button
          variant="basicBlack"
          onClick={() => setIsEdit(true)}
          className="mx-auto"
        >
          {" "}
          Editar{" "}
        </Button>
      ) : (
        <div className="mt-8 flex items-center justify-center gap-8">
          <Button
            variant="outline-black"
            size="md"
            type="button"
            onClick={handleCancel}
          >
            Cancelar
          </Button>
          <Button
            variant="icon"
            size="md"
            className="w-[180px] bg-[#202425]"
            type="button"
            onClick={handleSave}
            loading={loading}
          >
            {isEdit ? "Salvar" : "Registrar"}
          </Button>
        </div>
      )}
    </section>
  );
};

export default DocsCondoSection;
