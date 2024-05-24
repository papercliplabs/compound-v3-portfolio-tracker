"use client";
import { useScreenSize } from "@/hooks/useScreenSize";
import { ReactNode } from "react";
import NavDrawer from "./NavDrawer";

export default function NavSwitcher({ children }: { children: ReactNode }) {
  const screenSize = useScreenSize();

  return screenSize == "lg" ? (
    <div className="flex w-1/3 min-w-[380px] max-w-[480px] flex-col gap-3 overflow-hidden px-6 py-[56px]">
      {children}
    </div>
  ) : (
    <NavDrawer>{children}</NavDrawer>
  );
}
