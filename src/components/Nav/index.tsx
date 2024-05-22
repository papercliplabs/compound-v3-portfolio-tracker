import { Address } from "viem";
import { SupportedNetwork } from "@/utils/configs";
import { Separator } from "../ui/separator";
import React, { Suspense } from "react";
import { Skeleton } from "../ui/skeleton";
import NavHeader from "./NavHeader";
import { NavBody } from "./NavBody";
import NavSwitcher from "./NavSwitcher";

export interface NavProps {
  accountAddress: Address;
  selectedPositionParams?: {
    network: SupportedNetwork;
    marketAddress: Address;
  };
}

export default async function Nav({
  accountAddress,
  selectedPositionParams,
}: NavProps) {
  return (
    <NavSwitcher>
      <NavHeader accountAddress={accountAddress} />
      <Separator className="my-2 hidden md:flex" />
      <Suspense fallback={<Skeleton className="h-[300px] w-full" />}>
        <NavBody
          accountAddress={accountAddress}
          selectedPositionParams={selectedPositionParams}
        />
      </Suspense>
    </NavSwitcher>
  );
}
