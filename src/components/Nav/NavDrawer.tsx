"use client";
import { List, X } from "@phosphor-icons/react/dist/ssr";
import { ReactNode, useRef, useState } from "react";
import { Drawer } from "vaul";
import { Button } from "../ui/button";

const CLOSED_SNAP = "100px";
const OPEN_SNAP = 0.7;

export default function NavDrawer({ children }: { children: ReactNode }) {
  const [snap, setSnap] = useState<number | string | null>(CLOSED_SNAP);

  // Makes the component re-render when the height changes
  const ref = useRef<HTMLDivElement>(null);

  return (
    <Drawer.Root
      open={true}
      dismissible={false}
      modal={false}
      activeSnapPoint={snap}
      setActiveSnapPoint={setSnap}
      snapPoints={[CLOSED_SNAP, OPEN_SNAP]}
      noBodyStyles
    >
      {/* <Drawer.Overlay className="fixed inset-0 z-[5] bg-black/50" /> */}
      <Drawer.Portal>
        <Drawer.Content
          className="shadow-2 border-b-none border-border-primary fixed bottom-0 left-0 right-0 z-10 mx-[-1px] flex max-h-[97%] flex-col gap-3 rounded-t-[12px] border bg-white  px-4 py-5 lg:hidden"
          // style={{ height: `${OPEN_SNAP * 100}%` }}
          autoFocus={false}
          onFocus={() => ref.current?.blur()} // Prevent initial focus
          ref={ref}
        >
          <Button
            variant="ghost"
            size="icon"
            className="border-border-primary fixed right-[16px] top-[20px] border"
            onClick={() =>
              snap == CLOSED_SNAP ? setSnap(OPEN_SNAP) : setSnap(CLOSED_SNAP)
            }
          >
            {snap == CLOSED_SNAP ? <List /> : <X />}
          </Button>
          {children}
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
