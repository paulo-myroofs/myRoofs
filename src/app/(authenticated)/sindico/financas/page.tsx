import React from "react";

import AccountabilityTable from "./components/AccountabilityTable/accountabilityTable";
import TicketTable from "./components/TicketTable/ticketTable";

const Financas = () => {
  return (
    <section className="mx-auto w-11/12 max-w-[1500px] space-y-8">
      <AccountabilityTable />
      <TicketTable />
    </section>
  );
};

export default Financas;
