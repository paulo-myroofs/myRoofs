import React, { useEffect, useState } from "react";

import { Timestamp } from "firebase/firestore";

import { CondoCommonArea } from "@/common/entities/common/condo/condoCommonAreas";
import Button from "@/components/atoms/Button/button";
import { DatePickerMultiple } from "@/components/atoms/DatePickerMultiple/DatePickerMultiple";
import Label from "@/components/atoms/Label/label";
import InputField from "@/components/molecules/InputField/inputField";
import { errorToast } from "@/hooks/useAppToast";
import { timestampToDate } from "@/utils/timestampToDate";

import AddedInputCard from "./components/AddedInputCard";
import IconsSelector from "./components/IconsSelector/IconsSelector";
import { CommonAreasInputsProps } from "./types";

const inputClassName = "border-[#DEE2E6] bg-[#F8F9FA]";

const emptyMainInputs = {
  name: "",
  capacity: "",
  dates: undefined,
  type: undefined
};

const CommonAreaInputs = ({
  readOnly = false,
  commonAreas,
  setCommonAreas
}: CommonAreasInputsProps) => {
  const [toEditCommonArea, setToEditCommonArea] = useState<
    CondoCommonArea | undefined
  >();
  const [areInputsValid, setAreInputsValid] = useState(
    !commonAreas || commonAreas?.length === 0 || !!toEditCommonArea
  );

  const [mainInputs, setMainInputs] = useState<{
    name: string | undefined;
    capacity: string | undefined;
    dates: Date[] | undefined; // optional
    type: CondoCommonArea["type"] | undefined;
  }>(emptyMainInputs);

  const handleAddEdit = (type: "add" | "edit") => {
    if (!mainInputs.capacity)
      return errorToast("Adicone a capacidade da área comum");
    if (!mainInputs.type)
      return errorToast("Adicione um ícone associado à área comum");
    if (!mainInputs.name) return errorToast("Adicione um nome pra área comum");

    const commonAreaToAdd: CondoCommonArea = {
      name: mainInputs.name,
      capacity: parseInt(mainInputs.capacity),
      type: mainInputs.type,
      unavailableDates: mainInputs.dates
        ? mainInputs.dates?.map((d) => ({
            date: Timestamp.fromDate(d),
            periods: ["afternoon", "morning", "night"]
          }))
        : null
    };

    if (type === "add") {
      setCommonAreas((prev) =>
        prev ? [...prev, commonAreaToAdd] : [commonAreaToAdd]
      );
    }

    if (type === "edit") {
      setCommonAreas((prev) =>
        prev?.map((item) =>
          item.name === toEditCommonArea?.name ? commonAreaToAdd : item
        )
      );
      setToEditCommonArea(undefined);
    }

    setMainInputs(emptyMainInputs);
    setAreInputsValid(false);
  };

  useEffect(() => {
    if (toEditCommonArea) {
      setMainInputs(() => ({
        dates: toEditCommonArea.unavailableDates
          ? toEditCommonArea.unavailableDates?.map((i) =>
              timestampToDate(i.date)
            )
          : undefined,
        capacity: toEditCommonArea.capacity.toString(),
        type: toEditCommonArea.type,
        name: toEditCommonArea.name
      }));
    }
  }, [toEditCommonArea]);

  useEffect(() => {
    setAreInputsValid(
      !commonAreas || commonAreas?.length === 0 || !!toEditCommonArea
    );
  }, [commonAreas, toEditCommonArea]);

  const finalCommonAreas = toEditCommonArea
    ? commonAreas?.filter((i) => i.name !== toEditCommonArea.name)
    : commonAreas;

  return (
    <>
      {finalCommonAreas && finalCommonAreas?.length !== 0 && (
        <div className="space-y-4">
          {finalCommonAreas?.map((item) => (
            <AddedInputCard
              key={item.name}
              commonArea={item}
              readOnly={readOnly}
              onEdit={() => {
                setAreInputsValid(true);
                setToEditCommonArea(item);
              }}
              onRemove={() =>
                setCommonAreas((prev) =>
                  prev?.filter((i) => i.name !== item.name)
                )
              }
            />
          ))}
          {!areInputsValid && !readOnly && (
            <div className="flex w-full justify-end">
              <Button
                variant="icon"
                size="md"
                className="w-[180px] bg-[#202425]"
                type="button"
                onClick={() => setAreInputsValid(true)}
              >
                Adicionar Local
              </Button>
            </div>
          )}
        </div>
      )}

      {areInputsValid && (
        <div className="space-y-4">
          <InputField
            className={inputClassName}
            label="Nome"
            value={mainInputs.name}
            onChange={(e) =>
              setMainInputs((prev) => ({ ...prev, name: e.target.value }))
            }
            placeholder="Digite o nome do local..."
          />
          <InputField
            className={inputClassName}
            label="Capacidade"
            type="number"
            value={mainInputs.capacity}
            onChange={(e) =>
              setMainInputs((prev) => ({
                ...prev,
                capacity: e.target.value
              }))
            }
            placeholder="Digite aqui a quantidade de pessoas que o local comporta"
          />{" "}
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label className="text-sm">Ícone</Label>
              <IconsSelector
                activeIcon={mainInputs.type}
                setActiveIcon={(type) =>
                  setMainInputs((prev) => ({ ...prev, type }))
                }
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-sm">Datas Indisponíveis</Label>
              <DatePickerMultiple
                dates={mainInputs.dates}
                setDates={(dates) =>
                  setMainInputs((prev) => ({
                    ...prev,
                    dates
                  }))
                }
              />
            </div>
          </div>
          <div className="flex flex-row items-center justify-center gap-8">
            <Button
              variant="outline-black"
              size="md"
              type="button"
              className="mt-2 mb-4"
              onClick={
                toEditCommonArea
                  ? () => {
                      setMainInputs(emptyMainInputs);
                      setAreInputsValid(false);
                      setToEditCommonArea(undefined);
                    }
                  : () => {
                      setMainInputs(emptyMainInputs);
                      if (commonAreas && commonAreas?.length > 0) {
                        setAreInputsValid(false);
                      }
                    }
              }
            >
              Cancelar
            </Button>
            <Button
              variant="icon"
              size="md"
              className="mt-2 mb-4 bg-[#202425]"
              type="button"
              onClick={() => handleAddEdit(toEditCommonArea ? "edit" : "add")}
            >
              {toEditCommonArea ? "Editar" : "Adicionar"}
            </Button>
          </div>
          <span className="block h-[1px] w-full bg-[#868E96]"></span>
        </div>
      )}
    </>
  );
};

export default CommonAreaInputs;
