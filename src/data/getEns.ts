"use server";
import { Address, createPublicClient, fallback, http } from "viem";
import { unstable_cache } from "next/cache";
import { normalize } from "viem/ens";
import {
  getEnsName as getViemEnsName,
  getEnsAvatar as getViemEnsAvatar,
} from "viem/actions";
import { SECONDS_PER_WEEK } from "@/utils/constants";
import { getNetworkConfig } from "@/utils/configs";

export interface EnsInfoParams {
  address: Address;
}

const mainnetConfig = getNetworkConfig("mainnet");
const mainnetClient = createPublicClient({
  chain: mainnetConfig.chain,
  transport: fallback([http(mainnetConfig.rpcUrl.primary), http()]),
});

async function getEnsName({ address }: EnsInfoParams): Promise<string | null> {
  const ensName = await getViemEnsName(mainnetClient, { address });
  return ensName ?? null;
}

export const getEnsNameCached = unstable_cache(getEnsName, ["get-ens-name"], {
  revalidate: SECONDS_PER_WEEK,
});

async function getEnsAvatar({
  address,
}: EnsInfoParams): Promise<string | null> {
  const ensName = await getEnsNameCached({ address });
  const ensAvatar = ensName
    ? await getViemEnsAvatar(mainnetClient, { name: normalize(ensName) })
    : undefined;
  return ensAvatar ?? null;
}

export const getEnsAvatarCached = unstable_cache(
  getEnsAvatar,
  ["get-ens-avatar"],
  {
    revalidate: SECONDS_PER_WEEK,
  },
);
