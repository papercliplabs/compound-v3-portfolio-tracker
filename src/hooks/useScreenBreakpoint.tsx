import { tailwindFullTheme } from "@/theme/tailwindFullTheme";
import { useMediaQuery } from "usehooks-ts";

type Breakpoint = "sm" | "md" | "lg";

export function useScreenBreakpoint(): Breakpoint {
  const sm = useMediaQuery(
    `(max-width: ${tailwindFullTheme.theme.screens.sm})`,
  );
  const md = useMediaQuery(`(max-width:${tailwindFullTheme.theme.screens.md})`);

  return sm ? "sm" : md ? "md" : "lg";
}
