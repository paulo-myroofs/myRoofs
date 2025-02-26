import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import AptManagerInputs from "@/app/admin/nova-empresa/components/AptManagerInputs/AptManagerInputs";
import { brazilStates } from "@/common/constants/brazilStates";
import { maritalStatusOptions } from "@/common/constants/maritalStatusOptions";
import { AptManagerEntity } from "@/common/entities/aptManager";
import useProfile from "@/hooks/queries/useProfile";
import AddAptManagerSchema from "@/validations/admin/AddAptManager";

type AddAptManagerForm = z.infer<typeof AddAptManagerSchema>;

const AptManagerData = ({ aptManagerId }: { aptManagerId: string }) => {
  const { data: aptManager } = useProfile<AptManagerEntity>(aptManagerId);
  const {
    register,
    control,
    watch,
    formState: { errors },
    setValue
  } = useForm<AddAptManagerForm>({
    mode: "all",
    criteriaMode: "all",
    resolver: zodResolver(AddAptManagerSchema),
    values: {
      ownerBasicInfo: {
        name: aptManager?.name ?? "",
        cpf: aptManager?.cpf ?? "",
        rg: aptManager?.rg ?? "",
        emitter: aptManager?.emitter ?? "",
        profession: aptManager?.profession ?? "",
        maritalStatus:
          maritalStatusOptions?.find(
            (v) => v.label === aptManager?.maritalStatus
          )?.value ?? "",
        status: aptManager?.status ?? "",
        adminRole: aptManager?.adminRole ?? ""
      },
      ownerAddressData: {
        address: aptManager?.address ?? "",
        neighborhood: aptManager?.neighborhood ?? "",
        state:
          brazilStates.find((item) => item.label === aptManager?.state)
            ?.value ?? "",
        number: aptManager?.number ?? "",
        cep: aptManager?.cep ?? "",
        city: aptManager?.city ?? ""
      },
      ownerEmail: aptManager?.email ?? ""
    }
  });

  return (
    <div className="pointer-events-none mx-auto mt-4 max-w-[1200px] space-y-4 opacity-70">
      <AptManagerInputs<AddAptManagerForm>
        setValue={setValue}
        errors={errors}
        register={register}
        control={control}
        watch={watch}
      />
    </div>
  );
};

export default AptManagerData;
