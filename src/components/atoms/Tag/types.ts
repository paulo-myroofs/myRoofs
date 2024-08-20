import { VariantProps } from "tailwind-variants";

import { tagVariants } from "./Tag";

export type Ref = HTMLSpanElement;

export interface TagProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof tagVariants> {
  asChild?: boolean;
  loading?: boolean;
  className?: string;
  classNameText?: string;
}
