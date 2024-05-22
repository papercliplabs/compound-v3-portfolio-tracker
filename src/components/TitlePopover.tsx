import { ReactNode } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface TitlePopoverProps {
  title: string;
  children: ReactNode;
}

export default function TitlePopover({ title, children }: TitlePopoverProps) {
  return (
    <Popover>
      <PopoverTrigger className="text-body-md text-content-secondary border-border-primary my-[6px] w-fit border-b border-dashed pb-1 hover:brightness-90">
        {title}
      </PopoverTrigger>
      <PopoverContent>{children}</PopoverContent>
    </Popover>
  );
}
