"use client";
import { Address } from "viem";
import Image from "next/image";
import { getLinearGradientForAddress } from "@/utils/address";
import { Skeleton } from "@/components/ui/skeleton";
import { useEnsAvatar } from "@/hooks/useEnsAvatar";
import { useMemo } from "react";

interface AccountAvatarProps {
  address: Address;
  size: "sm" | "lg";
}

export default function AccountAvatar({ address, size }: AccountAvatarProps) {
  const ensAvatarQuery = useEnsAvatar({ address });
  const width = useMemo(() => (size == "sm" ? 20 : 64), [size]);

  console.log(ensAvatarQuery.data, ensAvatarQuery.isLoading);

  return ensAvatarQuery.isLoading ? (
    <Skeleton
      style={{ width: width, height: width }}
      className="rounded-full"
    />
  ) : ensAvatarQuery.data ? (
    <Image
      src={ensAvatarQuery.data}
      width={width}
      height={width}
      className="rounded-full object-cover"
      style={{ width, height: width }}
      alt=""
    />
  ) : (
    <div
      style={{
        background: getLinearGradientForAddress(address),
        height: width,
        width: width,
      }}
      className="rounded-full"
    />
  );
}
