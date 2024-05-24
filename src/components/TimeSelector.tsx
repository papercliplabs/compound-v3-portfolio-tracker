"use client";
import { TimeSelection } from "@/utils/types";
import clsx from "clsx";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { CalendarBlank } from "@phosphor-icons/react/dist/ssr";
import { tailwindFullTheme } from "@/theme/tailwindFullTheme";
import { DATA_FOR_TIME_SELECTOR } from "@/utils/constants";
import { useScreenSize } from "@/hooks/useScreenSize";

export function TimeSelector() {
  const options = Object.entries(DATA_FOR_TIME_SELECTOR).map(
    ([key, value]) => ({ selector: key as TimeSelection, ...value }),
  );
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const screenSize = useScreenSize();

  const selected = (searchParams.get("timeSelector") ?? "MAX") as TimeSelection;

  return (
    <Select
      onValueChange={(value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("timeSelector", value);
        router.push(pathname + "?" + params.toString(), {
          scroll: false,
        });
      }}
      value={selected}
    >
      <SelectTrigger className="w-fit">
        {screenSize != "sm" && (
          <CalendarBlank
            size={18}
            fill={tailwindFullTheme.theme.colors.content.primary}
          />
        )}
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {options.map((option, i) => (
          <SelectItem
            className={clsx(
              "text-caption-md h-8 w-full rounded-md px-2 py-1",
              selected == option.selector
                ? "bg-background-surface text-content-primary"
                : "hover:bg-background-surface/50 text-content-secondary bg-transparent",
            )}
            value={option.selector}
            key={i}
          >
            {screenSize == "sm" ? option.selector : option.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
