import Chart from "@/components/Chart";
import { getMarketsForAccountCached } from "@/data/queries/getMarketsForAccount";
import { getPortfolioActivityCached } from "@/data/queries/getPortfolioActivity";
import { getPortfolioHistoricalDataCached } from "@/data/queries/getPortfolioHistoricalData";
import { getPositionActivityCached } from "@/data/queries/getPositionActivity";
import { getPositionHistoricalDataCached } from "@/data/queries/getPositionHistoricalData";
import "@/utils/bigIntPolyfill";
import { getAddress } from "viem";

export default async function Home() {
  // const positionData = await getPositionHistoricalDataCached({
  //   network: "mainnet",
  //   marketAddress: "0xA17581A9E3356d9A858b789D68B4d866e593aE94", // ETH
  //   // marketAddress: "0xc3d688B66703497DAA19211EEdff47f25384cdc3", // USDC
  //   // accountAddress: "0xdf3b5d3f34df81a4416f1908f6ae1d48b8a8e7ae", // Personal
  //   accountAddress: "0xa2b6590a6dc916fe317dcab169a18a5b87a5c3d5", // Paperclip
  //   granularity: "weekly",
  // });

  // Liquidated
  // const positionData = await getPositionHistoricalDataCached({
  //   network: "mainnet",
  //   marketAddress: "0xc3d688b66703497daa19211eedff47f25384cdc3",
  //   accountAddress: "0x7f7bbb19026b5eca0b6cdb96caa84923716532a5",
  //   granularity: "daily",
  // });

  const accountAddress = getAddress(
    "0xa2b6590a6dc916fe317dcab169a18a5b87a5c3d5",
  );
  const granularity = "weekly";

  const markets = await getMarketsForAccountCached({
    accountAddress,
  });

  const portfolio = await getPortfolioHistoricalDataCached({
    accountAddress,
    granularity,
  });

  const portfolioActivity = await getPortfolioActivityCached({
    accountAddress,
  });

  console.log("PORT", portfolioActivity);

  return (
    <div className="flex h-full w-full grow flex-col items-start justify-start bg-green-200">
      <Chart data={portfolio!} dataKey="balanceUsd" />
      <Chart data={portfolio!} dataKey="avgApr.net" />
      {markets.map(async (market) => {
        const positionData = await getPositionHistoricalDataCached({
          network: market.network,
          marketAddress: market.address,
          accountAddress,
          granularity,
        });
        const positionActivity = await getPositionActivityCached({
          network: market.network,
          marketAddress: market.address,
          accountAddress,
        });
        // console.log(positionActivity);
        return (
          <>
            <Chart data={positionData!} dataKey="balanceUsd" />
          </>
        );
      })}
      {/* <Chart data={positionData!} dataKey="balanceUsd" />
      <Chart data={positionData!} dataKey="healthFactor" />
      <Chart data={positionData!} dataKey="profitAndLossUsd" />
      <Chart data={positionData!} dataKey="apr.net" /> */}
    </div>
  );
}
