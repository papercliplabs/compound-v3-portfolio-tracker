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
import { useEffect, useState } from "react";
import { PrefetchKind } from "next/dist/client/components/router-reducer/router-reducer-types";

export function TimeSelector() {
  const options = Object.entries(DATA_FOR_TIME_SELECTOR).map(
    ([key, value]) => ({ selector: key as TimeSelection, ...value }),
  );
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const screenSize = useScreenSize();
  const [optimisticallySelected, setOptimisticallySelected] = useState<
    TimeSelection | undefined
  >(undefined);

  const selected = (searchParams.get("timeSelector") ?? "MAX") as TimeSelection;

  useEffect(() => {
    // Prefetch all routes to reduce loading time on time selector change
    for (let option of options) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("timeSelector", option.selector);
      router.prefetch(pathname + "?" + params.toString(), {
        kind: PrefetchKind.AUTO,
      });
    }
  });

  return (
    <Select
      onValueChange={(value: string) => {
        setOptimisticallySelected(value as TimeSelection);
        const params = new URLSearchParams(searchParams.toString());
        params.set("timeSelector", value);
        router.push(pathname + "?" + params.toString(), {
          scroll: false,
        });
      }}
      // Optimistically update this value to help remove the delay from server response
      value={optimisticallySelected ?? selected}
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
