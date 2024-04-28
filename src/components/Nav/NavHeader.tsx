import { Address } from "viem";
import React, { Suspense } from "react";
import AccountAvatar from "../AccountAvatar";
import AccountName from "../AccountName";
import { Skeleton } from "../ui/skeleton";

export default function NavHeader({
  accountAddress,
}: {
  accountAddress: Address;
}) {
  return (
    <div className="flex flex-row items-center gap-4">
      <AccountAvatar address={accountAddress} size="lg" />
      <div className="flex h-full flex-col justify-between">
        <Suspense fallback={<Skeleton className="h-[30px] w-full shrink" />}>
          <h2 className="shrink">
            <AccountName address={accountAddress} />
          </h2>
        </Suspense>
        <div className="body-md text-content-secondary">
          <AccountName address={accountAddress} disableEns />
        </div>
      </div>
    </div>
  );
}
