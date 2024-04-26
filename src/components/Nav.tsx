import {
  Market,
  getMarketsForAccountCached,
} from "@/data/queries/getMarketsForAccount";
import { Address } from "viem";
import Token from "./Token";
import { SupportedNetwork } from "@/utils/configs";
import Link from "next/link";
import { Card } from "./ui/card";
import { Separator } from "./ui/separator";
import clsx from "clsx";
import { ReactNode } from "react";

interface NavProps {
  accountAddress: Address;
  selectedPositionParams?: {
    network: SupportedNetwork;
    marketAddress: Address;
  };
}

export default async function Nav({
  accountAddress,
  selectedPositionParams,
}: NavProps) {
  const markets = await getMarketsForAccountCached({ accountAddress });

  console.log(markets, selectedPositionParams);

  return (
    <div className=" flex w-[480px] flex-col  px-6 py-[56px]">
      ACCOUNT: {accountAddress} <Separator className="my-6" />
      <NavItem href={`/${accountAddress}`} active={!selectedPositionParams}>
        ALL POSITIONS
      </NavItem>
      {markets.map((market, i) => (
        <NavPositionLink
          accountAddress={accountAddress}
          market={market}
          active={market.address == selectedPositionParams?.marketAddress}
          key={i}
        />
      ))}
    </div>
  );
}

function NavPositionLink({
  accountAddress,
  market,
  active,
}: {
  accountAddress: Address;
  market: Market;
  active: boolean;
}) {
  return (
    <NavItem
      active={active}
      href={`/${accountAddress}/${market.network}/${market.address}`}
    >
      <Token
        symbol={market.baseTokenSymbol}
        network={market.network}
        size={32}
        showNetworkIcon
      />
      {market.baseTokenSymbol} • {market.network}
    </NavItem>
  );
}

function NavItem({
  active,
  children,
  href,
}: {
  active: boolean;
  children: ReactNode;
  href: string;
}) {
  return (
    <Link
      href={href}
      className={clsx(
        "flex w-full flex-row rounded-md px-4 py-2 ",
        active ? "bg-white" : "hover:bg-white/30",
      )}
    >
      {children}
    </Link>
  );
}
