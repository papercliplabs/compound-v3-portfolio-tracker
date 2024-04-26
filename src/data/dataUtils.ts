import { getNetworkConfig, SupportedNetwork } from "@/utils/configs";
import { GraphQLFetchParams, graphQLFetch } from "./graphql/graphQLFetch";

type QuerySubgraphParams<Result, Variables> = {
  network: SupportedNetwork;
} & Omit<GraphQLFetchParams<Result, Variables>, "url">;

export async function querySubgraph<Result, Variables>({
  network,
  ...queryParams
}: QuerySubgraphParams<Result, Variables>) {
  return graphQLFetch({
    url: getNetworkConfig(network).subgraphUrl,
    ...queryParams,
  });
}
