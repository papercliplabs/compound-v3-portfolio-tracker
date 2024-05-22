import * as React from "react";

import { cn } from "@/utils/chadcn";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "invalid:border-semantic-critical text-caption-md placeholder-shown:bg-background-muted placeholder-shown:text-content-secondary border-border-primary ring-offset-background focus-visible:ring-ring flex h-8 w-full rounded-md border bg-white px-2 py-[6px] pl-[30px] file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder-shown:border-none invalid:border-2 focus:bg-white focus-visible:outline-none   focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        style={{
          backgroundImage: "url(/image/magnifying-glass.svg)",
          backgroundPosition: "8px center",
          backgroundRepeat: "no-repeat",
        }}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
