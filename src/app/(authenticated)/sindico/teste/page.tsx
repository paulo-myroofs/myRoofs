"use client";

import { useState } from "react";

import { PropagaModal } from "@/app/admin/condominios/ver-mais/[condoId]/components/EditPropaganda/EditPropaganda";
import Button from "@/components/atoms/Button/button";

export default function TestePage() {
  const [isPropagandaOpen, setIsPropagandaOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <Button
        onClick={() => setIsPropagandaOpen(true)}
        variant="success"
        size="lg"
        className="border-2 border-black"
      >
        Abrir Propaganda
      </Button>

      <PropagaModal
        isOpen={isPropagandaOpen}
        onOpenChange={setIsPropagandaOpen}
      />
    </div>
  );
}
