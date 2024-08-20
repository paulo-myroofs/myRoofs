import { forwardRef } from "react";

import { Slot } from "@radix-ui/react-slot";
import { tv } from "tailwind-variants";

import { cn } from "@/lib/utils";

import { TagProps, Ref } from "./types";

import LoadingComponent from "../Loading/loading";

export const tagVariants = tv({
  base: "rounded-[10px] outline-none py-[3px] px-[16px]",
  variants: {
    size: {
      smFit: "text-[12px] w-fit",
      smLarge: "w-[126px] text-[12px] text-center",
      mdFit: "w-fit text-[20px]",
      mdLarge: "w-[178px] text-center text-[20px]"
    },
    variant: {
      greenBlack: "bg-verde-maisEscuro text-black",
      greenWhite: "bg-verde-maisEscuro text-white",
      red: "bg-vermelho-maisClaroSec text-black",
      yellowBlack: "bg-amarelo-maisClaro text-black",
      yellowWhite: "bg-amarelo-maisClaro text-white",
      grey: "bg-cinza-maisClaro text-black",
      lightPurple: "bg-roxo-claro text-white",
      darkBlue: "bg-azul-escuro text-white"
    }
  },
  defaultVariants: {
    size: "mdFit",
    variant: "greenBlack"
  }
});

const Tag = forwardRef<Ref, TagProps>(
  (
    {
      loading = false,
      className,
      size,
      variant = "greenBlack",
      asChild = false,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "span";

    const loadingVariant = {
      greenBlack: "text-black",
      greenWhite: "text-white",
      red: "text-black",
      yellowBlack: "text-black",
      yellowWhite: "text-white",
      grey: "text-black",
      lightPurple: "text-white",
      darkBlue: "text-white"
    } as const;

    if (loading) {
      return (
        <Comp
          className={tagVariants({
            className,
            size,
            variant
          })}
          ref={ref}
        >
          <LoadingComponent
            className={cn("h-4 w-4", loadingVariant[variant])}
          />
        </Comp>
      );
    }

    return (
      <Comp
        className={tagVariants({
          className,
          size,
          variant
        })}
        ref={ref}
        {...props}
      />
    );
  }
);
Tag.displayName = "Tag";

export default Tag;
