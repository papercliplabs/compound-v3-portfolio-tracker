"use client";
import { Address } from "viem";
import Image from "next/image";
import { getLinearGradientForAddress } from "@/utils/address";
import { Skeleton } from "@/components/ui/skeleton";
import { useEnsAvatar } from "@/hooks/useEnsAvatar";
import { HTMLAttributes, forwardRef, useMemo } from "react";

interface AccountAvatarProps {
  address: Address;
}

const AccountAvatar = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement> & AccountAvatarProps
>(({ address, ...props }, ref) => {
  const ensAvatarQuery = useEnsAvatar({ address });

  return (
    <div {...props}>
      {ensAvatarQuery.isLoading ? (
        <Skeleton className="h-full w-full rounded-full" />
      ) : ensAvatarQuery.data ? (
        <Image
          src={ensAvatarQuery.data}
          width={64} // upper bound
          height={64} // upper bound
          className="h-full w-full rounded-full object-cover"
          alt=""
        />
      ) : (
        <div
          style={{
            background: getLinearGradientForAddress(address),
          }}
          className="h-full w-full rounded-full"
        />
      )}
    </div>
  );
});
AccountAvatar.displayName = "AccountAvatar";

export default AccountAvatar;
