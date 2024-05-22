"use client";
import { useScreenBreakpoint } from "@/hooks/useScreenBreakpoint";
import { ReactNode } from "react";
import NavDrawer from "./NavDrawer";

export default function NavSwitcher({ children }: { children: ReactNode }) {
  const breakpoint = useScreenBreakpoint();
  return breakpoint == "lg" ? (
    <div className="flex w-full min-w-[380px] max-w-[500px] flex-col gap-3 px-6 py-[56px]">
      {children}
    </div>
  ) : (
    <NavDrawer>{children}</NavDrawer>
  );
}
