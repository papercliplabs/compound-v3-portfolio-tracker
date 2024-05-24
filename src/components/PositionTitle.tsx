import { getPositionForAccount } from "@/data/queries/getPositionsForAccount";
import { SupportedNetwork, getNetworkConfig } from "@/utils/configs";
import { Address } from "viem";
import Token from "./Token";
import { Badge } from "./ui/badge";
import { AT_RISK_HEALTH_FACTOR_THRESHOLD } from "@/utils/constants";
import { Warning } from "@phosphor-icons/react/dist/ssr";

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
        size={36}
        showNetworkIcon
      />
      <h1 className="text-body text-content-primary whitespace-nowrap font-semibold">
        {position.market.baseTokenSymbol} •{" "}
        {getNetworkConfig(position.market.network).chain.name}
      </h1>
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
  );
}
