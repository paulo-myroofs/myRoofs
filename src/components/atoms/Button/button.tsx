import { forwardRef } from "react";

import { Slot } from "@radix-ui/react-slot";
import { tv } from "tailwind-variants";

import { cn } from "@/lib/utils";

import { ButtonProps, Ref } from "./types";

import LoadingComponent from "../Loading/loading";

export const buttonVariants = tv({
  base: "rounded-lg outline-none flex flex-row items-center justify-center gap-2 transition-colors cursor-pointer border disabled:cursor-not-allowed hover:scale-[103%] transition-all",
  variants: {
    size: {
      sm: "py-1.25 px-3 text-[14px] sm:h-[2rem] sm:w-[9rem] sm:text-[16px]",
      md: "h-[2.75rem] w-[9.5rem] text-sm",
      lg: "py-2.5 px-[18px]",
      xl: "w-[10rem] h-[2rem] lg:w-[20rem] lg:h-[3.75rem]",
      xxl: "w-[18rem] h-[2rem] lg:w-[31.25rem] lg:h-[3.75rem]",
      icon: "p-2",
      note: "w-[10rem] h-[2.0625rem] sm:w-[20rem] sm:h-[2.25rem] lg:w-[42rem] lg:h-[3.25rem]"
    },
    variant: {
      success:
        "bg-primary-600 hover:bg-primary-700 disabled:bg-primary-50 disabled:border-primary-50 active:bg-primary-600 border-primary-600 hover:border-primary-700 text-base-white disabled:text-primary-400",
      "secondary-gray":
        "border-gray-300 bg-base-white hover:bg-gray-50 disabled:bg-gray-50 disabled:border-gray-200 text-gray-700 disabled:text-gray-300",
      "secondary-color":
        "bg-primary-50 border-primary-700 hover:bg-primary-100 hover:border-primary-100 disabled:bg-primary-25 disabled:border-primary-25 text-primary-800 disabled:text-primary-300",
      "tertiary-gray":
        "bg-transparent border-transparent hover:bg-gray-50 text-gray-600 disabled:text-gray-300",
      "tertiary-color":
        "bg-transparent border-transparent hover:bg-primary-50 text-primary-700 disabled:text-gray-300",
      destructive:
        "bg-error-600 border-error-600 hover:border-bg-error-700 hover:bg-error-700 disabled:bg-error-200 disabled:border-error-200 text-base-white disabled:text-base-white",
      login:
        "bg-[rgba(0,220,82,1)] hover:bg-[rgba(0,220,82,1)] disabled:bg-[rgba(0,220,82,0.5)] text-white rounded-full text-xs lg:text-xl border-transparent",
      "outline-black":
        "border-black bg-white hover:bg-gray-50 disabled:bg-gray-50 text-black rounded-full text-xs lg:text-sm",
      icon: "border-transparent bg-black text-white hover:bg-black hover:color-white rounded-full",
      squareOutline:
        "border-black bg-white hover:bg-gray-50 disabled:bg-gray-50 text-black font-normal rounded-sm lg:text-base",
      note: "bg-black hover:bg-black text-white rounded-full text-base font-normal",
      basicBlack: "bg-[#202425] text-white "
    }
  },
  defaultVariants: {
    size: "md",
    variant: "success"
  }
});

const Button = forwardRef<Ref, ButtonProps>(
  (
    {
      loading = false,
      disabled,
      className,
      size,
      variant = "success",
      asChild = false,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";

    const loadingVariant = {
      "secondary-color": "text-primary-600",
      "secondary-gray": "text-gray-800",
      success: "text-base-white",
      destructive: "text-base-white",
      "tertiary-color": "text-base-white",
      "tertiary-gray": "text-base-white",
      login: "text-white",
      "outline-black": "text-black",
      squareOutline: "text-black",
      icon: "text-white",
      note: "text-white",
      basicBlack: "text-white"
    } as const;

    if (loading) {
      return (
        <Comp
          className={buttonVariants({
            className,
            size,
            variant
          })}
          ref={ref}
          disabled={true}
        >
          <LoadingComponent
            className={cn("h-4 w-4", loadingVariant[variant])}
          />
        </Comp>
      );
    }

    return (
      <Comp
        disabled={disabled}
        className={buttonVariants({ className, size, variant })}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export default Button;
