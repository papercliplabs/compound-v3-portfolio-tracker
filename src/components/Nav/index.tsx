import { Address } from "viem";
import { SupportedNetwork } from "@/utils/configs";
import { Separator } from "../ui/separator";
import React, { Suspense } from "react";
import { Skeleton } from "../ui/skeleton";
import NavHeader from "./NavHeader";
import { NavBody } from "./NavBody";

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
    <div className="flex w-full min-w-[380px] max-w-[500px] flex-col gap-3 px-6 py-[56px]">
      <NavHeader accountAddress={accountAddress} />
      <Separator className="my-6" />
      <Suspense fallback={<Skeleton className="h-[300px] w-full" />}>
        <NavBody
          accountAddress={accountAddress}
          selectedPositionParams={selectedPositionParams}
        />
      </Suspense>
    </div>
  );
}
