import Chart from "@/components/Chart";
import { getPositionHistoricalDataCached } from "@/data/queries/getPositionHistoricalData";
import "@/utils/bigIntPolyfill";

export default async function Home() {
  // const data = await getMarketHistoricalDataCached({
  //   network: "mainnet",
  //   marketAddress: "0xa17581a9e3356d9a858b789d68b4d866e593ae94",
  //   granularity: "daily",
  // });

  // const positionData = await getPositionHistoricalDataCached({
  //   network: "mainnet",
  //   marketAddress: "0xA17581A9E3356d9A858b789D68B4d866e593aE94", // ETH
  //   // marketAddress: "0xc3d688B66703497DAA19211EEdff47f25384cdc3", // USDC
  //   // accountAddress: "0xdf3b5d3f34df81a4416f1908f6ae1d48b8a8e7ae", // Personal
  //   accountAddress: "0xa2b6590a6dc916fe317dcab169a18a5b87a5c3d5", // Paperclip
  //   granularity: "weekly",
  // });

  // Liquidated
  const positionData = await getPositionHistoricalDataCached({
    network: "mainnet",
    marketAddress: "0xc3d688b66703497daa19211eedff47f25384cdc3",
    accountAddress: "0x7f7bbb19026b5eca0b6cdb96caa84923716532a5",
    granularity: "weekly",
  });

  // {
  //   key: 2758,
  //   timestamp: 1668038423,
  //   balance: 0n,
  //   balanceUsd: 0,
  //   rewardsAccrued: 0n,
  //   rewardsAccruedUsd: 0,
  //   profitAndLossUsd: 0
  // },
  // {
  //   key: 2759,
  //   timestamp: 1668646883,
  //   balance: 13086097857n,
  //   balanceUsd: 13087.184,
  //   rewardsAccrued: 0n,
  //   rewardsAccruedUsd: 0,
  //   profitAndLossUsd: 13087.184
  // },
  // {
  //   key: 2760,
  //   timestamp: 1669250087,
  //   balance: 13090747071n,
  //   balanceUsd: 13089.0847,
  //   rewardsAccrued: 0n,
  //   rewardsAccruedUsd: 0,
  //   profitAndLossUsd: 13089.0847
  // },
  // {
  //   key: 2761,
  //   timestamp: 1669853003,
  //   balance: 13095607173n,
  //   balanceUsd: 13095.725,
  //   rewardsAccrued: 0n,
  //   rewardsAccruedUsd: 0,
  //   profitAndLossUsd: 13095.725
  // },
  // {
  //   key: 2762,
  //   timestamp: 1670458463,
  //   balance: 15773506198n,
  //   balanceUsd: 15773.238,
  //   rewardsAccrued: 0n,
  //   rewardsAccruedUsd: 0,
  //   profitAndLossUsd: 12.05884342003992
  // },

  console.log(
    "POSITION DATA",
    positionData?.slice(0, 100).map((i) => i.healthFactor),
  );
  return (
    <div className="flex h-full w-full grow flex-col items-start justify-start bg-green-200">
      <Chart data={positionData!} dataKey="balanceUsd" />
      <Chart data={positionData!} dataKey="profitAndLossUsd" />
      <Chart data={positionData!} dataKey="healthFactor" />
    </div>
  );
}
