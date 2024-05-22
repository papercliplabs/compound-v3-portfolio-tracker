"use server";
import { Address, createPublicClient, fallback, http } from "viem";
import { unstable_cache } from "next/cache";
import { getEnsAddress, normalize } from "viem/ens";
import {
  getEnsName as getViemEnsName,
  getEnsAvatar as getViemEnsAvatar,
} from "viem/actions";
import { SECONDS_PER_DAY, SECONDS_PER_WEEK } from "@/utils/constants";
import { getNetworkConfig } from "@/utils/configs";

export interface EnsInfoParams {
  address: Address;
}

const mainnetConfig = getNetworkConfig("mainnet");
const mainnetClient = createPublicClient({
  chain: mainnetConfig.chain,
  transport: http(mainnetConfig.rpcUrl.primary),
  // transport: fallback([
  //   http(mainnetConfig.rpcUrl.primary),
  //   http(mainnetConfig.rpcUrl.fallback),
  // ]),
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
  console.log("GET START");
  const ensName = await getEnsNameCached({ address });
  console.log("GET NAME", ensName);
  const ensAvatar = ensName
    ? await getViemEnsAvatar(mainnetClient, { name: normalize(ensName) })
    : undefined;

  console.log("GET DOEN", ensName, ensAvatar);
  return ensAvatar ?? null;
}

export const getEnsAvatarCached = unstable_cache(
  getEnsAvatar,
  ["get-ens-avatar"],
  {
    revalidate: SECONDS_PER_WEEK,
  },
);

async function getAddressForEnsNameUncached({
  ensName,
}: {
  ensName: string;
}): Promise<Address | null> {
  try {
    const address = await getEnsAddress(mainnetClient, {
      name: normalize(ensName),
      strict: true,
    });

    return address;
  } catch (e) {
    console.log(e);
    return null;
  }
}

export const getAddressForEnsName = unstable_cache(
  getAddressForEnsNameUncached,
  ["get-address-for-ens"],
  { revalidate: SECONDS_PER_DAY },
);
