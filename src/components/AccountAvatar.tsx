"use client";
import { Address } from "viem";
import Image from "next/image";
import { getLinearGradientForAddress } from "@/utils/address";
import { Skeleton } from "@/components/ui/skeleton";
import { useEnsAvatar } from "@/hooks/useEnsAvatar";
import { useMemo } from "react";
import { useScreenBreakpoint } from "@/hooks/useScreenBreakpoint";

interface AccountAvatarProps {
  address: Address;
  size: "sm" | "lg" | "dynamic";
}

export default function AccountAvatar({ address, size }: AccountAvatarProps) {
  const ensAvatarQuery = useEnsAvatar({ address });
  const breakpoint = useScreenBreakpoint();
  const width = useMemo(() => {
    const sizeInternal =
      size == "dynamic" ? (breakpoint == "lg" ? "lg" : "sm") : size;
    return sizeInternal == "sm" ? 20 : 64;
  }, [size, breakpoint]);

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
