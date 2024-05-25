import { SupportedNetwork, getNetworkConfig } from "@/utils/configs";
import { Address } from "viem";
import { TimeSelector } from "./TimeSelector";
import { Suspense } from "react";
import { Skeleton } from "./ui/skeleton";
import { getPositionForAccount } from "@/data/queries/getPositionsForAccount";
import Token from "./Token";
import { Badge } from "./ui/badge";
import { Warning } from "@phosphor-icons/react/dist/ssr";
import { AT_RISK_HEALTH_FACTOR_THRESHOLD } from "@/utils/constants";

interface TitleBarProps {
  positionParams?: {
    network: SupportedNetwork;
    marketAddress: Address;
    accountAddress: Address;
  };
}

export async function TitleBar({ positionParams }: TitleBarProps) {
  return (
    <div className="flex flex-row items-center justify-between">
      {positionParams ? (
        <Suspense fallback={<Skeleton className="h-[28px] w-[120px]" />}>
          <PositionTitle {...positionParams} />
        </Suspense>
      ) : (
        <h3>All Position</h3>
      )}
      <TimeSelector />
    </div>
  );
}

export async function PositionTitle({
  network,
  marketAddress,
  accountAddress,
}: {
  network: SupportedNetwork;
  marketAddress: Address;
  accountAddress: Address;
}) {
  const position = await getPositionForAccount({
    network,
    marketAddress,
    accountAddress,
  });

  if (!position) {
    return null;
  }

  return (
    <div className="flex flex-row flex-wrap items-center gap-2">
      <Token
        symbol={position.market.baseTokenSymbol}
        network={position.market.network}
        size={24}
        showNetworkIcon
      />
      <h3 className="text-body text-content-primary whitespace-nowrap font-semibold">
        {position.market.baseTokenSymbol} •{" "}
        {getNetworkConfig(position.market.network).chain.name}
      </h3>
      <div className="hidden gap-2 md:flex">
        <Badge>
          {position.summary.balanceUsd >= 0 ? "Lending" : "Borrowing"}
        </Badge>
        {position.summary.balanceUsd < 0 &&
          position.summary.healthFactor < AT_RISK_HEALTH_FACTOR_THRESHOLD && (
            <Badge variant="warning" className="flex flex-row gap-1">
              At risk <Warning size={12} weight="bold" />
            </Badge>
          )}
      </div>
    </div>
  );
}
