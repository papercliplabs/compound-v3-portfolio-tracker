"use client";
import { ReactNode } from "react";
import NavDrawer from "./NavDrawer";

export default function NavSwitcher({ children }: { children: ReactNode }) {
  return (
    <>
      <div className="sticky top-[64px] hidden max-h-[calc(100dvh-64px)] w-[400px] min-w-[400px] max-w-[400px] flex-col gap-3 overflow-hidden px-6 py-[56px] lg:flex xl:w-[480px] xl:min-w-[480px] xl:max-w-[480px]">
        {children}
      </div>
      <NavDrawer>{children}</NavDrawer>
    </>
  );
}
