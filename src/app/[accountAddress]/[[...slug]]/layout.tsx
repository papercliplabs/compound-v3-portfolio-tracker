import Nav from "@/components/Nav";
import NavDrawer from "@/components/Nav/NavDrawer";
import { TimeSelector } from "@/components/TimeSelector";
import { Card } from "@/components/ui/card";
import { SupportedNetwork, getNetworkConfig } from "@/utils/configs";
import { redirect } from "next/navigation";
import { Suspense } from "react";
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
    <div className="flex h-full flex-col justify-between md:flex-row">
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
      <div className="flex h-full min-w-0 grow flex-col justify-start gap-4 border-l px-4 pb-[132px] pt-8 md:px-16 md:pb-14 md:pt-14">
        <Card>
          <TimeSelector />
        </Card>
        <Suspense fallback="LOADING!!!">
          {isPosition ? position : portfolio}
        </Suspense>
      </div>
    </div>
  );
}
