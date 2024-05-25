import { Address } from "viem";
import React, { Suspense } from "react";
import AccountAvatar from "@/components/AccountAvatar";
import AccountName from "@/components/AccountName";
import { Skeleton } from "@/components/ui/skeleton";

export default function NavHeader({
  accountAddress,
}: {
  accountAddress: Address;
}) {
  return (
    <div className="flex flex-row items-center gap-4 pb-[18px] md:pb-0">
      <AccountAvatar
        address={accountAddress}
        className="h-[32px] w-[32px] shrink-0 lg:h-[64px] lg:w-[64px]"
      />
      <div className="flex h-full min-w-0 flex-col justify-center md:justify-between">
        <Suspense fallback={<Skeleton className="h-[30px] w-full shrink" />}>
          <h2 className="shrink overflow-hidden text-ellipsis">
            <AccountName address={accountAddress} />
          </h2>
        </Suspense>
        <div className="body-md text-content-secondary hidden lg:flex">
          <AccountName address={accountAddress} disableEns />
        </div>
      </div>
    </div>
  );
}
