import { Market } from "@/data/queries/getMarketsForAccount";
import { getNetworkConfig } from "@/utils/configs";
import { formatNumber } from "@/utils/format";
import clsx from "clsx";
import Link from "next/link";
import { forwardRef } from "react";
import { twMerge } from "tailwind-merge";
import { Address } from "viem";
import Token from "../Token";
import { Warning } from "@phosphor-icons/react/dist/ssr";
import { tailwindFullTheme } from "@/theme/tailwindFullTheme";
import UtilizationRing from "../UtilizationRing";

export interface NavPositionLinkProps {
  accountAddress: Address;
  market: Market;
  active: boolean;

  balanceUsd: number;
  utilization: number;
  apr: number;
  atRisk: boolean;
  small?: boolean;
}

export function NavPositionLink({
  accountAddress,
  market,
  active,
  balanceUsd,
  utilization,
  apr,
  atRisk,
  small,
}: NavPositionLinkProps) {
  return (
    <NavItem
      active={active}
      href={`/${accountAddress}/${market.network}/${market.address}`}
      small
      className={small ? "bg-white" : ""}
    >
      <Token
        symbol={market.baseTokenSymbol}
        network={market.network}
        size={small ? 20 : 32}
        showNetworkIcon
      />
      <div className={clsx("flex w-full flex-row justify-between")}>
        <div
          className={clsx(
            "flex ",
            balanceUsd < 0 ? "justify-between" : "justify-center",
            small ? "flex-row gap-2" : "flex-col",
          )}
        >
          <span
            className={clsx(
              "text-body text-content-primary flex flex-row items-center whitespace-nowrap font-semibold",
              small && "hidden md:flex",
            )}
          >
            {market.baseTokenSymbol} •{" "}
            {getNetworkConfig(market.network).chain.name}
            {atRisk && (
              <Warning
                size={12}
                weight="bold"
                className="ml-2"
                fill={tailwindFullTheme.theme.colors.semantic.warning}
              />
            )}
          </span>
          {balanceUsd < 0 && (
            <span className="caption-md text-content-secondary flex flex-row items-center gap-1">
              <div className="h-[14px] w-[14px]">
                <UtilizationRing value={utilization} />{" "}
              </div>
              {formatNumber(utilization, "%", 2)} {!small && "utilized"}
            </span>
          )}
        </div>
        {!small && (
          <div className="flex flex-col items-end">
            <span>${formatNumber(Math.abs(balanceUsd))}</span>
            <span className="caption-md text-content-secondary">
              {formatNumber(apr, "%")} APR (7D)
            </span>
          </div>
        )}
      </div>
    </NavItem>
  );
}

export const NavItem = forwardRef<
  HTMLAnchorElement,
  React.HTMLAttributes<HTMLAnchorElement> & {
    active: boolean;
    href: string;
    small?: boolean;
  }
>(({ active, href, small, className, ...props }, ref) => {
  return (
    <Link
      ref={ref}
      href={href}
      className={twMerge(
        "flex flex-row items-center rounded-md bg-transparent",
        small ? "gap-[6px] px-2 py-1" : "h-[48px] w-full gap-[10px] px-4 py-2",
        active
          ? "bg-background-surface md:bg-white"
          : "hover:bg-background-surface/30 bg-transparent md:hover:bg-white/30",
        className,
      )}
      {...props}
    />
  );
});
NavItem.displayName = "NavItem";
