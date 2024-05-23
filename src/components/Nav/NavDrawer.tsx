"use client";
import { List, X } from "@phosphor-icons/react/dist/ssr";
import { ReactNode, useRef, useState } from "react";
import { Drawer } from "vaul";
import { Button } from "../ui/button";
import { useScreen } from "usehooks-ts";

const CLOSED_SNAP = "100px";
const OPEN_SNAP = 0.7;

export default function NavDrawer({ children }: { children: ReactNode }) {
  const [snap, setSnap] = useState<number | string | null>(CLOSED_SNAP);

  // Makes the component re-render when the height changes
  const screen = useScreen();
  const ref = useRef<HTMLDivElement>(null);

  return (
    <Drawer.Root
      open={true}
      dismissible={false}
      snapPoints={[CLOSED_SNAP, OPEN_SNAP]}
      activeSnapPoint={snap}
      setActiveSnapPoint={setSnap}
      modal={false}
      fadeFromIndex={0}
    >
      <Drawer.Portal>
        <Drawer.Content
          className="shadow-2 border-b-none border-border-primary fixed left-0 right-0 mx-[-1px] flex flex-col gap-3 rounded-t-[12px] border bg-white px-4 py-5"
          style={{ height: `${OPEN_SNAP * 100}%`, top: 30 }}
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
