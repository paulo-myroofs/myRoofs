"use client";
import React from "react";

import Image from "next/image";
import { useRouter } from "next/navigation";

import { AptManagerEntity } from "@/common/entities/aptManager";
import Button from "@/components/atoms/Button/button";
import LoadingComponent from "@/components/atoms/Loading/loading";
import useCondosByAptManagerId from "@/hooks/queries/condos/useCondosByAptManagerId";
import useProfile from "@/hooks/queries/useProfile";
import useAuth from "@/hooks/useAuth";
import { storageSet } from "@/store/services/storage";

const ChooseCondo = () => {
  const router = useRouter();
  const { userUid } = useAuth();
  const { data: user } = useProfile<AptManagerEntity>(userUid);
  const { data: condos } = useCondosByAptManagerId(userUid as string);

  const handleSelectCondo = (id: string) => {
    storageSet("condoId", id);
    router.push("/sindico");
  };

  return (
    <main className="relative flex h-full min-h-screen w-full items-center justify-center overflow-hidden  bg-[#0D1714]">
      <Image
        src={"/vector-line.svg"}
        width={1000}
        height={400}
        alt="Vetor de estilização"
        className="absolute -left-10 -top-[10%] -rotate-12"
      />

      <div className="z-20 my-32 w-11/12 max-w-[1400px] rounded-[20px] bg-[#F1F3F5] py-12 text-center md:p-10">
        {user ? (
          <>
            <h1 className="text-[18px] font-medium sm:text-[28px]">
              Bem vindo, {user?.name}!{" "}
            </h1>
            <h2 className="text-[18px] font-medium sm:text-[28px]">
              Selecione o condomínio que deseja gerenciar:{" "}
            </h2>

            {condos && condos.length > 0 && (
              <div className="mx-auto max-w-[80%] space-y-3">
                {condos?.map((item) => (
                  <Button
                    key={item.id}
                    onClick={() => handleSelectCondo(item.id)}
                    className="mt-8 w-full border border-[#C7C8CA] bg-white py-8 font-normal"
                  >
                    {" "}
                    {item.name}
                  </Button>
                ))}
              </div>
            )}

            {!user.isSecondary && (
              <Button
                className="mx-auto mt-8 w-[200px] font-normal"
                variant="basicBlack"
                onClick={() => router.push("/sindico/novo-condominio")}
              >
                {" "}
                Novo condomínio{" "}
              </Button>
            )}
          </>
        ) : (
          <div className="m-auto flex items-center justify-center">
            <LoadingComponent />
          </div>
        )}
      </div>

      <Image
        src={"/vector-line.svg"}
        width={1000}
        height={400}
        className="absolute -bottom-10 -right-20 -rotate-[20deg]"
        alt="Vetor de estilização"
      />
    </main>
  );
};

export default ChooseCondo;
