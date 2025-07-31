"use client";

import { useState } from "react";

import { AdvertisementModal } from "@/app/admin/condominios/ver-mais/[condoId]/components/EditAdvertisement/EditAdvertisement";
import Button from "@/components/atoms/Button/button";

export default function TestePage() {
  const [isadvertisementOpen, setIsadvertisementOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <Button
        onClick={() => setIsadvertisementOpen(true)}
        variant="success"
        size="lg"
        className="border-2 border-black"
      >
        Abrir propaganda
      </Button>

      <AdvertisementModal
        isOpen={isadvertisementOpen}
        onOpenChange={setIsadvertisementOpen}
      />
    </div>
  );
}
