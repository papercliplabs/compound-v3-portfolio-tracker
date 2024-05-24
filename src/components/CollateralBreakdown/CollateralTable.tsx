import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AugmentedCollateralDataEntry } from ".";
import Token from "../Token";
import { formatNumber } from "@/utils/format";

export default function CollateralTable({
  data,
}: {
  data: AugmentedCollateralDataEntry[];
}) {
  return (
    <Table className="w-full max-w-[700px]">
      <TableHeader>
        <TableRow className="text-caption-md text-content-secondary font-semibold">
          <TableHead className="w-[100px]">Collateral</TableHead>
          <TableHead className="text-right">%</TableHead>
          <TableHead className="text-right">Value</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="text-caption-md text-content-primary font-semibold">
        {data.map((entry, i) => (
          <TableRow key={i}>
            <TableCell className="flex flex-row items-center gap-1 font-medium">
              <div
                className="mr-1 h-2 w-2 rounded-[2px]"
                style={{ backgroundColor: entry.color }}
              />
              <Token
                symbol={entry.assetSymbol}
                size={20}
                network="mainnet"
                showNetworkIcon={false}
              />
              {entry.assetSymbol}
            </TableCell>
            <TableCell className="text-right">
              {formatNumber(entry.percent, "%")}
            </TableCell>
            <TableCell className="text-right">
              {formatNumber(entry.balanceUsd, "$")}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
