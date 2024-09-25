import Nav from "@/components/Nav";
import NavDrawer from "@/components/Nav/NavDrawer";
import { TimeSelector } from "@/components/TimeSelector";
import { TitleBar } from "@/components/TitleBar";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
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
    <div className="flex h-full flex-row justify-between overflow-y-hidden">
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
      <div className="flex h-full min-w-0 grow flex-col overflow-y-scroll overscroll-none border-l">
        <div
          className="sticky top-0 z-[4] px-4 py-2 shadow-sm backdrop-blur-[6px] md:px-16"
          style={{
            backgroundImage: `linear-gradient(180deg, white, rgb(255, 255, 255, 0.6))`,
          }}
        >
          <TitleBar
            positionParams={
              isPosition
                ? {
                    network: network as SupportedNetwork,
                    marketAddress: getAddress(marketAddressString!),
                    accountAddress: accountAddress,
                  }
                : undefined
            }
          />
        </div>
        <div className="flex min-w-0 grow flex-col justify-start gap-4 px-4 pb-32 pt-4 md:px-16 md:pt-8 lg:pb-12">
          <Suspense
            fallback={Array(5)
              .fill(0)
              .map((_, i) => (
                <Skeleton className="shadow-1 h-[277px] w-full" key={i} />
              ))}
          >
            {isPosition ? position : portfolio}
          </Suspense>
        </div>
      </div>
    </div>
  );
}
