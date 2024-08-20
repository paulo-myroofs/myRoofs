"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { z } from "zod";

import PublicOnlyFeatureWrapper from "@/components/templates/Public/public";
import SignInFormSchema from "@/validations/signIn";
import Button from "@atoms/Button/button";
import Logo from "@atoms/Logo/Logo";
import { errorToast } from "@hooks/useAppToast";
import useAuth from "@hooks/useAuth";
import InputField from "@molecules/InputField/inputField";

type SignInForm = z.infer<typeof SignInFormSchema>;

export default function LoginPage() {
  const { loginWithInternalService, loading, forgotPassword } = useAuth();

  const {
    handleSubmit,
    register,
    watch,
    formState: { errors }
  } = useForm<SignInForm>({
    mode: "all",
    criteriaMode: "all",
    resolver: zodResolver(SignInFormSchema)
  });

  const handleSubmitForm = (data: SignInForm) => {
    loginWithInternalService(data.email, data.password);
  };

  const handleForgotPassword = () => {
    if (!watch("email")) {
      return errorToast("Preencha o campo de email.");
    }
    forgotPassword(watch("email"));
  };

  return (
    <PublicOnlyFeatureWrapper>
      <main className="relative flex h-screen w-full items-center">
        <Image
          src="/vector-retangle.svg"
          fill
          priority
          sizes={"100vw"}
          alt="Vector de estilo"
          className="z-0 object-cover lg:hidden"
        />
        <Image
          src="/vector-line-2.svg"
          width={100}
          height={50}
          className="absolute bottom-0 right-0 z-0 lg:hidden"
          alt="Vector de estilo"
        />

        <div className="hidden h-screen w-1/2 overflow-hidden bg-[#0D1714] lg:block">
          <div className="relative h-screen w-[110%]">
            <Image
              src={"/vector-line.svg"}
              fill
              sizes="50vw"
              alt="Logo de MyRoofs"
            />
          </div>
        </div>

        <div className="flex h-screen w-full flex-col items-center justify-center gap-y-4 bg-[#00FF5F] lg:w-1/2">
          <motion.span
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Logo />
          </motion.span>
          <motion.form
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            className={
              "z-20 flex w-11/12 max-w-lg flex-col gap-3 rounded-[20px] bg-[#202425] p-8 pt-10"
            }
            style={{
              boxShadow: "0px 0px 13.3px 0px rgba(255, 255, 255, 0.25)"
            }}
            onSubmit={handleSubmit(handleSubmitForm)}
          >
            <span className="mx-auto mb-4 flex lg:hidden">
              <Logo color="#00FF5F" width="220" height="52" />
            </span>
            <InputField
              labelClassName="text-white"
              register={register}
              name="email"
              placeholder="email@email.com"
              label="E-mail"
              type="email"
              formErrors={errors}
            />
            <InputField
              labelClassName="text-white"
              register={register}
              name="password"
              type="password"
              placeholder="********"
              label="Senha"
              formErrors={errors}
            />
            <Button
              type="submit"
              className="mt-6 w-full"
              size="lg"
              variant="login"
              loading={
                loading.loginWithInternalService || loading.forgotPassword
              }
            >
              Login
            </Button>
            <button
              type="button"
              className="mt-6 text-verde-principal transition-all hover:scale-[103%] hover:underline"
              onClick={handleForgotPassword}
            >
              {" "}
              Esqueceu senha?{" "}
            </button>{" "}
          </motion.form>
        </div>
      </main>
    </PublicOnlyFeatureWrapper>
  );
}
