"use client";
import { PortfolioActivity } from "@/data/queries/getPortfolioActivity";
import { Activity, ActivityType } from "@/data/queries/getPositionActivity";
import { ColumnDef } from "@tanstack/react-table";
import { selectItems } from ".";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatNumber } from "@/utils/format";
import {
  SECONDS_PER_DAY,
  SECONDS_PER_HOUR,
  SECONDS_PER_MONTH,
  SECONDS_PER_WEEK,
  SECONDS_PER_YEAR,
} from "@/utils/constants";
import { getNetworkConfig } from "@/utils/configs";
import ExternalLink from "../ExternalLink";
import { Button } from "../ui/button";
import Token from "../Token";

export const Columns: ColumnDef<PortfolioActivity>[] = [
  {
    accessorKey: "type",
    header: ({ table }) => (
      // TODO(spennyp): Add "Type to the seelctor"
      <Select
        onValueChange={(value) =>
          table
            .getColumn("type")
            ?.setFilterValue(
              value == "all" ? undefined : (value as ActivityType),
            )
        }
        value={(table.getColumn("type")?.getFilterValue() as string) ?? "all"}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          {selectItems.map((item, i) => (
            <SelectItem value={item.value} key={i}>
              {item.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    ),
    cell: ({ row }) => {
      const type = row.getValue("type");
      const name = selectItems.find((item) => item.value == type)?.name;
      return name;
    },
  },
  {
    accessorKey: "marketAddress",
    header: "Market",
    cell: ({ row }) => {
      // TODO(spennyp): this is the token symbol, but not the market
      const symbol = row.original.tokenSymbol;
      const network = row.original.network;

      return (
        <div className="flex h-full flex-row items-center gap-1">
          <Token symbol={symbol} network={network} size={30} showNetworkIcon />
          <div>
            {symbol} • {getNetworkConfig(network).chain.name}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "amountUsd",
    header: "Amount (USD)",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amountUsd"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);

      return formatted;
    },
  },
  {
    accessorKey: "timestamp",
    header: "Age",
    cell: ({ row }) => {
      const timestamp = parseFloat(row.getValue("timestamp"));
      const now = new Date();
      const timestampDate = new Date(timestamp * 1000);

      const deltaS = (now.getTime() - timestampDate.getTime()) / 1000;

      let val;

      const years = Math.floor(deltaS / SECONDS_PER_YEAR);
      if (years > 0) {
        val = years + " year" + (years > 1 ? "s" : "");
      } else {
        const months = Math.floor(deltaS / SECONDS_PER_MONTH);
        if (months > 0) {
          val = months + " month" + (months > 1 ? "s" : "");
        } else {
          const days = Math.floor(deltaS / SECONDS_PER_DAY);
          if (days > 0) {
            val = days + " day" + (days > 1 ? "s" : "");
          } else {
            const hours = Math.floor(deltaS / SECONDS_PER_HOUR);
            if (hours > 0) {
              val = hours + " hour" + (hours > 1 ? "s" : "");
            } else {
              const minutes = Math.floor(deltaS / 60);
              val = minutes + " minutes" + (minutes > 1 ? "s" : "");
            }
          }
        }
      }

      return val + " agos";
    },
  },
  {
    accessorKey: "txnHash",
    header: "Txn",
    cell: ({ row }) => {
      const explorerUrl =
        getNetworkConfig(row.original.network).chain.blockExplorers?.default
          .url +
        "/tx/" +
        row.original.txnHash;
      return (
        <ExternalLink href={explorerUrl}>
          <Button variant="secondary">View</Button>
        </ExternalLink>
      );
    },
  },
];
