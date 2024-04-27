import { cn } from "@/utils/chadcn";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("bg-content-disabled animate-pulse rounded-md", className)}
      {...props}
    />
  );
}

export { Skeleton };
