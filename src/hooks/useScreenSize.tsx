import { tailwindFullTheme } from "@/theme/tailwindFullTheme";
import { useEffect, useState } from "react";
import { useMediaQuery } from "usehooks-ts";

type ScreenSize = "sm" | "md" | "lg" | undefined;

export function useScreenSize(): ScreenSize {
  const [screenSize, setScreenSize] = useState<ScreenSize>("lg");

  const sm = useMediaQuery(
    `(max-width: ${tailwindFullTheme.theme.screens.sm})`,
  );
  const md = useMediaQuery(`(max-width:${tailwindFullTheme.theme.screens.md})`);

  useEffect(() => {
    setScreenSize(sm ? "sm" : md ? "md" : "lg");
  }, [sm, md]);

  return screenSize;
}
