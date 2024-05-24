"use server";
import { SupportedNetwork } from "@/utils/configs";
import { Address, Hex, formatUnits, getAddress } from "viem";
import { querySubgraph } from "../dataUtils";
import { graphql } from "../graphql/generated";
import { unstable_cache } from "next/cache";
import { DEFAULT_REVALIDATION_TIME_S } from "../graphql/graphQLFetch";
import { formatNumber } from "@/utils/format";

export type ActivityType =
  | "supply-base" // lend, repay, or transfer to
  | "withdraw-base" // remove lend, borrow, or transfer from
  | "supply-collateral" // supply or transfer to
  | "withdraw-collateral" // withdraw or transfer from
  | "absorb-debt"
  | "claim-reward";

export interface Activity {
  type: ActivityType;
  timestamp: number;
  txnHash: Hex;
  tokenAddress: Address;
  tokenSymbol: string;
  amountFormatted: string;
  amountUsd: number;
}

interface GetPositionActivityParams {
  network: SupportedNetwork;
  marketAddress: Address;
  accountAddress: Address;
}

async function getPositionActivity({
  network,
  marketAddress,
  accountAddress,
}: GetPositionActivityParams): Promise<Activity[]> {
  const positionId =
    marketAddress.toLowerCase() + accountAddress.toLowerCase().slice(2);
  const queryResp = await querySubgraph({
    network,
    query,
    variables: {
      positionId,
    },
  });

  const position = queryResp?.position;

  if (!position) {
    console.error(
      "getPositionActivity - no activity found ",
      marketAddress,
      accountAddress,
    );
    return [];
  }

  const supplyBaseActivity = mapInteractionsToActivity({
    type: "supply-base",
    interactions: position.supplyBaseInteractions,
  });
  const withdrawBaseActivity = mapInteractionsToActivity({
    type: "withdraw-base",
    interactions: position.withdrawBaseInteractions,
  });
  const transferBaseFrom = mapInteractionsToActivity({
    type: "withdraw-base",
    interactions: position.transferFromBaseInteractions,
  });
  const transferBaseTo = mapInteractionsToActivity({
    type: "supply-base",
    interactions: position.transferToBaseInteractions,
  });

  const supplyCollateralActivity = mapInteractionsToActivity({
    type: "supply-collateral",
    interactions: position.supplyCollateralInteractions,
  });
  const withdrawCollateralActivity = mapInteractionsToActivity({
    type: "withdraw-collateral",
    interactions: position.withdrawCollateralInteractions,
  });
  const transferCollateralFromActivity = mapInteractionsToActivity({
    type: "withdraw-collateral",
    interactions: position.transferFromCollateralInteractions,
  });
  const transferCollateralToActivity = mapInteractionsToActivity({
    type: "supply-collateral",
    interactions: position.transferToCollateralInteractions,
  });

  const absorbDebtActivity = mapInteractionsToActivity({
    type: "absorb-debt",
    interactions: position.absorbDebtInteractions,
  });

  const claimRewardActivity = mapInteractionsToActivity({
    type: "claim-reward",
    interactions: position.rewardsClaimedInteractions,
  });

  const positionActivity = [
    ...supplyBaseActivity,
    ...withdrawBaseActivity,
    ...transferBaseFrom,
    ...transferBaseTo,
    ...absorbDebtActivity,
    ...supplyCollateralActivity,
    ...withdrawCollateralActivity,
    ...transferCollateralFromActivity,
    ...transferCollateralToActivity,
    ...claimRewardActivity,
  ];

  positionActivity.sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1));

  return positionActivity;
}

const query = graphql(/* GraphQL */ `
  query positionActivity($positionId: ID!) {
    position(id: $positionId) {
      supplyBaseInteractions(first: 1000) {
        transaction {
          hash
          timestamp
        }
        asset {
          token {
            address
            symbol
            decimals
          }
        }
        amount
        amountUsd
      }
      withdrawBaseInteractions(first: 1000) {
        transaction {
          hash
          timestamp
        }
        asset {
          token {
            address
            symbol
            decimals
          }
        }
        amount
        amountUsd
      }

      transferFromBaseInteractions(first: 1000) {
        transaction {
          hash
          timestamp
        }
        asset {
          token {
            address
            symbol
            decimals
          }
        }
        amount
        amountUsd
      }

      transferToBaseInteractions(first: 1000) {
        transaction {
          hash
          timestamp
        }
        asset {
          token {
            address
            symbol
            decimals
          }
        }
        amount
        amountUsd
      }

      supplyCollateralInteractions(first: 1000) {
        transaction {
          hash
          timestamp
        }
        asset {
          token {
            address
            symbol
            decimals
          }
        }
        amount
        amountUsd
      }
      withdrawCollateralInteractions(first: 1000) {
        transaction {
          hash
          timestamp
        }
        asset {
          token {
            address
            symbol
            decimals
          }
        }
        amount
        amountUsd
      }
      transferFromCollateralInteractions(first: 1000) {
        transaction {
          hash
          timestamp
        }
        asset {
          token {
            address
            symbol
            decimals
          }
        }
        amount
        amountUsd
      }
      transferToCollateralInteractions(first: 1000) {
        transaction {
          hash
          timestamp
        }
        asset {
          token {
            address
            symbol
            decimals
          }
        }
        amount
        amountUsd
      }

      absorbDebtInteractions(first: 1000) {
        transaction {
          hash
          timestamp
        }
        asset {
          token {
            address
            symbol
            decimals
          }
        }
        amount
        amountUsd
      }

      rewardsClaimedInteractions(first: 1000) {
        transaction {
          hash
          timestamp
        }
        asset: token {
          address
          symbol
          decimals
        }
        amount
        amountUsd
      }
    }
  }
`);

function mapInteractionsToActivity({
  type,
  interactions,
}: {
  type: ActivityType;
  interactions: {
    transaction: { hash: string; timestamp: string };
    asset:
      | {
          token: {
            address: string;
            symbol: string;
            decimals?: number | null;
          };
        }
      | {
          address: string;
          symbol: string;
          decimals?: number | null;
        }; // Rewards doesn't have asset
    amount: string;
    amountUsd: string;
  }[];
}): Activity[] {
  return interactions.map((interaction) => {
    const token: {
      address: string;
      symbol: string;
      decimals?: number | null;
    } =
      (
        interaction.asset as {
          token: {
            address: string;
            symbol: string;
            decimals?: number | null;
          };
        }
      ).token != undefined
        ? (interaction.asset as any).token
        : interaction.asset;
    return {
      type,
      timestamp: Number(interaction.transaction.timestamp),
      txnHash: interaction.transaction.hash as Hex,
      tokenAddress: getAddress(token.address),
      tokenSymbol: token.symbol,
      amountFormatted: token.decimals
        ? formatNumber(
            Number(formatUnits(BigInt(interaction.amount), token.decimals)),
          )
        : "UNKNOWN",
      amountUsd: Number(interaction.amountUsd),
    } as Activity;
  });
}

// Cache here instead of on fetch (fetch is still cached) to avoid doing the data transformations every time
export const getPositionActivityCached = unstable_cache(
  getPositionActivity,
  ["get-position-activity"],
  {
    revalidate: DEFAULT_REVALIDATION_TIME_S,
  },
);
