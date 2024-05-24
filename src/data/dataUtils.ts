import { getNetworkConfig, SupportedNetwork } from "@/utils/configs";
import { GraphQLFetchParams, graphQLFetch } from "./graphql/graphQLFetch";

type QuerySubgraphParams<Result, Variables> = {
  network: SupportedNetwork;
} & Omit<GraphQLFetchParams<Result, Variables>, "url">;

export async function querySubgraph<Result, Variables>({
  network,
  ...queryParams
}: QuerySubgraphParams<Result, Variables>): Promise<Result | undefined> {
  try {
    return graphQLFetch({
      url: getNetworkConfig(network).subgraphUrl,
      ...queryParams,
    });
  } catch (e) {
    // Allow site to try to recover with missing data...
    console.error(e);
    return undefined;
  }
}
