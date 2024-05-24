import { getPortfolioActivity } from "@/data/queries/getPortfolioActivity";
import { Address } from "viem";
import { PortfolioColumns } from "./PortfolioColumns";
import ClientActivityTable from "./ClientActivityTable";
import { getPositionActivityCached } from "@/data/queries/getPositionActivity";
import { Activity, ActivityType } from "@/data/queries/getPositionActivity";
import { ColumnDef } from "@tanstack/react-table";
import { selectItems } from "./ClientActivityTable";
import { SupportedNetwork } from "@/utils/configs";
import { PositionColumns } from "./PositionColumns";

interface PortfolioActivityTableProps {
  accountAddress: Address;
}

export async function PortfolioActivityTable({
  accountAddress,
}: PortfolioActivityTableProps) {
  const portfolioActivity = await getPortfolioActivity({
    accountAddress,
  });

  return (
    <ClientActivityTable data={portfolioActivity} columns={PortfolioColumns} />
  );
}

interface PositionActivityTableProps {
  network: SupportedNetwork;
  marketAddress: Address;
  accountAddress: Address;
}

export async function PositionActivityTable({
  network,
  marketAddress,
  accountAddress,
}: PositionActivityTableProps) {
  const positionActivity = await getPositionActivityCached({
    network,
    marketAddress,
    accountAddress,
  });

  const positionActivityWithNetwork = positionActivity.map((a) => ({
    ...a,
    network,
  }));

  return (
    <ClientActivityTable
      data={positionActivityWithNetwork}
      columns={PositionColumns}
    />
  );
}
