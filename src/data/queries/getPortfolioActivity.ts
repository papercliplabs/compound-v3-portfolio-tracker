import { SupportedNetwork } from "@/utils/configs";
import { Address } from "viem";
import { Activity, getPositionActivityCached } from "./getPositionActivity";
import { Market, getMarketsForAccountCached } from "./getMarketsForAccount";

export interface PortfolioActivity extends Activity {
  market: Market;
}

interface GetPortfolioActivityParams {
  accountAddress: Address;
}

export async function getPortfolioActivity({
  accountAddress,
}: GetPortfolioActivityParams): Promise<PortfolioActivity[]> {
  const markets = await getMarketsForAccountCached({ accountAddress });

  const positionActivityPromises = markets?.map((market) =>
    getPositionActivityCached({
      network: market.network,
      marketAddress: market.address,
      accountAddress,
    }),
  );

  const positionActivityResponses = await Promise.all(positionActivityPromises);

  const portfolioActivity: PortfolioActivity[] = [];
  for (let i = 0; i < markets.length; i++) {
    const market = markets[i];
    const activity = positionActivityResponses[i];

    for (let entry of activity) {
      portfolioActivity.push({
        ...entry,
        market,
      });
    }
  }

  // Order by timestamp, descending
  portfolioActivity.sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1));

  return portfolioActivity;
}
