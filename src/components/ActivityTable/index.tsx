import { getPortfolioActivity } from "@/data/queries/getPortfolioActivity";
import { Address } from "viem";
import { Columns } from "./Columns";
import ClientActivityTable from "./ClientActivityTable";

interface ActivityTableProps {
  accountAddress: Address;
}

export async function ActivityTable({ accountAddress }: ActivityTableProps) {
  const portfolioActivity = await getPortfolioActivity({
    accountAddress,
  });

  return <ClientActivityTable data={portfolioActivity} columns={Columns} />;
}
