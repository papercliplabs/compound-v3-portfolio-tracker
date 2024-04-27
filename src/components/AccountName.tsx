import { getEnsNameCached } from "@/data/getEns";
import { shortAddress } from "@/utils/address";
import { Address } from "viem";

interface AccountNameProps {
  address: Address;
  disableEns?: boolean;
}

export default async function AccountName({
  address,
  disableEns,
}: AccountNameProps) {
  const ensName = disableEns ? null : await getEnsNameCached({ address });
  const name = ensName ?? shortAddress(address);

  return <>{name}</>;
}
