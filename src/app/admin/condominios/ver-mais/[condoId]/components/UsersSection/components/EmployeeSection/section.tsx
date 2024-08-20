import { useParams } from "next/navigation";

import { EmployeeEntity } from "@/common/entities/employee";
import LoadingComponent from "@/components/atoms/Loading/loading";
import useEmployeesByCondoId from "@/hooks/queries/employee/useEmployeesByCondoId";
import formatToPhoneMask from "@/utils/formatToPhoneMask";

import { columns } from "./columns";
import { EmployeeColumnData } from "./types";

import TableSection from "../TableSection/TableSection";

const EmployeeSection = () => {
  const { condoId } = useParams();
  const { data: employeeData, isLoading } = useEmployeesByCondoId(
    condoId as string,
    (data) =>
      data.map(
        (item: EmployeeEntity) =>
          ({
            email: item.email,
            name: item.name,
            phone: item.phone ? formatToPhoneMask(item.phone) : "",
            occupation: item.occupation
          }) as EmployeeColumnData
      )
  );

  if (isLoading) {
    return (
      <div className="flex h-[30vh] items-center justify-center">
        <LoadingComponent />
      </div>
    );
  }

  return (
    <TableSection title="Funcionários" data={employeeData} columns={columns} />
  );
};

export default EmployeeSection;
