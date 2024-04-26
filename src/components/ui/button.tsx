import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/utils/chadcn";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md body-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:bg-background-disabled disabled:text-content-disabled",
  {
    variants: {
      variant: {
        primary: "bg-content-primary text-white hover:bg-content-primary/90",
        secondary:
          "bg-white text-content-primary border hover:bg-background-surface",
        destructive:
          "bg-semantic-critical text-white hover:bg-semantic-critical/90",
        ghost: "bg-transparent hover:bg-background-surface",
      },
      size: {
        default: "h-fit w-fit px-3 py-1",
        icon: "h-fit w-fit p-[6px]",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
