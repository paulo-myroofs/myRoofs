import React from "react";

import OrdersTable from "./components/OrdersTable/OrdersTable";
import VisitsTable from "./components/VisitsTable/VisitsTable";

const VisitasEncomendas = () => {
  return (
    <section className="mx-auto w-11/12 max-w-[1500px] space-y-8">
      <VisitsTable />
      <OrdersTable />
    </section>
  );
};

export default VisitasEncomendas;
