"use client";
import { TimeSelection } from "@/utils/types";
import clsx from "clsx";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function TimeSelector() {
  const options: TimeSelection[] = ["7D", "1M", "3M", "1Y", "MAX"];
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const selected = (searchParams.get("timeSelector") ?? "MAX") as TimeSelection;

  return (
    <div className="flex flex-row gap-2">
      {options.map((option, i) => (
        <button
          className={clsx(
            "text-caption-md h-8 w-fit rounded-md px-2 py-1",
            selected == option
              ? "bg-background-surface text-content-primary"
              : "hover:bg-background-surface/50 text-content-secondary bg-transparent",
          )}
          onClick={() => {
            const params = new URLSearchParams(searchParams.toString());
            params.set("timeSelector", option);
            router.push(pathname + "?" + params.toString(), { scroll: false });
          }}
          key={i}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
