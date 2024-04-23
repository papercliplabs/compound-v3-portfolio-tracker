import { getChainConfig, SupportedNetwork } from "@/utils/configs";
import { GraphQLFetchParams, graphQLFetch } from "./graphql/graphQLFetch";

type QuerySubgraphParams<Result, Variables> = {
  network: SupportedNetwork;
} & Omit<GraphQLFetchParams<Result, Variables>, "url">;

export async function querySubgraph<Result, Variables>({
  network,
  ...queryParams
}: QuerySubgraphParams<Result, Variables>) {
  return graphQLFetch({
    url: getChainConfig(network).subgraphUrl,
    ...queryParams,
  });
}
