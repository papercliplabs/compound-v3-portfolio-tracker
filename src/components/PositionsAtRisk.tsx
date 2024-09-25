import { AT_RISK_HEALTH_FACTOR_THRESHOLD } from "@/utils/constants";
import { Address } from "viem";
import { Card } from "@/components/ui/card";
import { Warning } from "@phosphor-icons/react/dist/ssr";
import { NavPositionLink } from "./Nav/NavPositionLink";
import { getPositionsForAccount } from "@/data/queries/getPositionsForAccount";

interface PositionsAtRiskProps {
  accountAddress: Address;
}

export default async function PositionsAtRisk({
  accountAddress,
}: PositionsAtRiskProps) {
  const positions = await getPositionsForAccount({ accountAddress });
  const atRiskPositions = positions.filter(
    (position) =>
      position.summary.balanceUsd < 0 &&
      position.summary.healthFactor < AT_RISK_HEALTH_FACTOR_THRESHOLD,
  );

  if (atRiskPositions.length == 0) {
    // Hide if there are none
    return null;
  }

  return (
    <Card className="text-semantic-warning animate-in flex flex-col gap-2 border-[#FFD3BB] bg-[#FFE5D6] md:flex-row md:items-center">
      <div className="flex gap-2">
        <Warning size={16} className="min-w-[16px]" weight="bold" />
        <div className="text-body whitespace-nowrap font-semibold">
          Positions at risk:
        </div>
      </div>
      <div className="flex w-full flex-row gap-2 overflow-x-auto">
        {atRiskPositions.map((position, i) => {
          return (
            <NavPositionLink
              accountAddress={accountAddress}
              market={position.market}
              active={false}
              balanceUsd={position.summary.balanceUsd}
              utilization={position.summary.utilization}
              apr={position.summary.apr.net}
              atRisk={false} // Not using here, already known
              small={true}
              key={i}
            />
          );
        })}
      </div>
    </Card>
  );
}
