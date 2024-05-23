import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/utils/chadcn";

const badgeVariants = cva(
  "inline-flex items-center h-fit w-fit rounded-full border px-1.5 py-[1px] text-caption-md font-semibold transition-colors",
  {
    variants: {
      variant: {
        default: "border-transparent bg-background-muted text-content-primary",
        warning: "bg-[#FFE5D6] text-semantic-warning border-transparent",
        outline: "text-content-primary",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
