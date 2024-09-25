"use client";
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import { useState } from "react";

export default function TestPage() {
  const [activeSnapPoint, setActiveSnapPoint] = useState<any>(0.1);

  return (
    <div className="h-[4000px] overflow-y-auto bg-yellow-300">
      TEST
      <Drawer
        open
        dismissible={false}
        snapPoints={[0.2, 0.8]}
        activeSnapPoint={activeSnapPoint}
        setActiveSnapPoint={setActiveSnapPoint}
        modal={false}
        noBodyStyles
      >
        0{" "}
        <DrawerContent className="fixed bottom-[0px] left-0 right-0 mt-0 h-[90dvh] bg-pink-200">
          <DrawerHeader>
            <DrawerTitle>Are you absolutely sure?</DrawerTitle>
            <DrawerDescription>This action cannot be undone.</DrawerDescription>
          </DrawerHeader>
        </DrawerContent>
      </Drawer>
      {/* <div className="fixed bottom-0 left-0 right-0 h-[200px] bg-pink-400">
        FIXED
      </div> */}
    </div>
  );
}
