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
      <PopoverContent>
        <div className="flex flex-col gap-3">
          <span className="text-body text-content-primary font-semibold">
            {title}
          </span>
          <span className="text-body text-content-secondary ">{children}</span>
        </div>
      </PopoverContent>
    </Popover>
  );
}
