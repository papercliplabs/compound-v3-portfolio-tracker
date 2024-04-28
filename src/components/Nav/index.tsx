import {
  Market,
  getMarketsForAccountCached,
} from "@/data/queries/getMarketsForAccount";
import { Address } from "viem";
import Token from "../Token";
import { SupportedNetwork, getNetworkConfig } from "@/utils/configs";
import Link from "next/link";
import { Separator } from "../ui/separator";
import React, { Suspense } from "react";
import { Stack } from "@phosphor-icons/react/dist/ssr";
import { twMerge } from "tailwind-merge";
import AccountAvatar from "../AccountAvatar";
import AccountName from "../AccountName";
import { Skeleton } from "../ui/skeleton";
import { getPositionHistoricalDataCached } from "@/data/queries/getPositionHistoricalData";
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
    <div className=" flex w-[480px] shrink-0 flex-col gap-3 px-6 py-[56px]">
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
