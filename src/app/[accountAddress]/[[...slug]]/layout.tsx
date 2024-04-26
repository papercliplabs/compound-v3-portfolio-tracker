import Nav from "@/components/Nav";
import { SupportedNetwork, getNetworkConfig } from "@/utils/configs";
import { redirect } from "next/navigation";
import { getAddress, isAddress } from "viem";

export default function Layout({
  portfolio,
  position,
  params,
}: Readonly<{
  portfolio: React.ReactNode;
  position: React.ReactNode;
  params: {
    accountAddress: string;
    slug?: string[]; // undefined or [network, marketAddress]
  };
}>) {
  // Validate account address
  const accountAddressValid = isAddress(params.accountAddress);
  if (!accountAddressValid) {
    redirect("/");
  }

  const accountAddress = getAddress(params.accountAddress);

  const isPosition = params.slug?.length == 2;
  const network = params.slug?.[0];
  const marketAddressString = params.slug?.[1];
  const networkValid = getNetworkConfig(network as any) != undefined;
  const marketAddressValid =
    marketAddressString && isAddress(marketAddressString);

  // Validate network and market
  if (isPosition && (!networkValid || !marketAddressValid)) {
    redirect(`/${accountAddress}`);
  }

  return (
    <div className="flex flex-row justify-between">
      <Nav
        accountAddress={accountAddress}
        selectedPositionParams={
          isPosition
            ? {
                network: network as SupportedNetwork, // Checked above
                marketAddress: getAddress(marketAddressString!), // Checked above
              }
            : undefined
        }
      />
      {isPosition ? position : portfolio}
    </div>
  );
}
