import { SupportedNetwork } from "@/utils/configs";
import { Address } from "viem";
import { getPositionForAccount } from "@/data/queries/getPositionsForAccount";
import { CollateralPieChart } from "./CollateralPieChart";
import { tailwindFullTheme } from "@/theme/tailwindFullTheme";
import { formatNumber } from "@/utils/format";
import CollateralTable from "./CollateralTable";
import { Skeleton } from "../ui/skeleton";
import CollateralChange from "./CollateralChange";
import { Suspense } from "react";

const dataColorsTheme = tailwindFullTheme.theme.colors.data;
const dataColors = [
  dataColorsTheme.series1,
  dataColorsTheme.series2,
  dataColorsTheme.series3,
  dataColorsTheme.series4,
  dataColorsTheme.series5,
  dataColorsTheme.series6,
];

export interface AugmentedCollateralDataEntry {
  assetSymbol: string;
  balanceUsd: number;
  percent: number;
  color: string;
}

export interface CollateralBreakdownProps {
  network: SupportedNetwork;
  marketAddress: Address;
  accountAddress: Address;
}

export async function CollateralBreakdown({
  network,
  marketAddress,
  accountAddress,
}: CollateralBreakdownProps) {
  const positionSummary = await getPositionForAccount({
    network,
    marketAddress,
    accountAddress,
  });

  if (!positionSummary || positionSummary.summary.balanceUsd >= 0) {
    return null;
  }

  const collateralData = positionSummary.summary.collateral;
  const collateralDataFiltered = collateralData.filter((d) => d.balanceUsd > 0);
  const totalCollateralUsd = collateralDataFiltered.reduce(
    (acc, entry) => acc + entry.balanceUsd,
    0,
  );

  const augmentedCollateralData: AugmentedCollateralDataEntry[] =
    collateralDataFiltered.map((d, i) => ({
      ...d,
      percent: d.balanceUsd / totalCollateralUsd,
      color: dataColors[i % dataColors.length],
    }));

  const collateralRatio =
    totalCollateralUsd / Math.abs(positionSummary.summary.balanceUsd);

  return (
    <div className="flex flex-col items-center gap-[16px] pt-8 md:flex-row md:items-start xl:gap-[72px]">
      <div className="h-[240px] w-[240px]">
        <CollateralPieChart data={augmentedCollateralData} />
      </div>
      <div className="flex grow flex-col gap-8">
        <CollateralTable data={augmentedCollateralData} />
        <div className="flex gap-10">
          <div className="flex flex-col">
            <h3>{formatNumber(collateralRatio, "%")}</h3>
            <span className="text-caption-md text-content-secondary font-semibold">
              Collateral Ratio
            </span>
          </div>
          <div className="flex flex-col">
            <Suspense fallback={<Skeleton className="h-[30px] w-[50px]" />}>
              <CollateralChange
                network={network}
                marketAddress={marketAddress}
                accountAddress={accountAddress}
              />
            </Suspense>
            <span className="text-caption-md text-content-secondary font-semibold">
              Value change (past 24h)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
