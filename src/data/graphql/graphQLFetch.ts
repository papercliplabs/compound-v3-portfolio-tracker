import { GraphQLError } from "graphql";
import { TypedDocumentString } from "./generated/graphql";

export const DEFAULT_REVALIDATION_TIME_S = 100;

type GraphQLResponse<Data> = { data: Data } | { errors: GraphQLError[] };

export interface CacheConfig {
  cache?: RequestCache;
  next?: NextFetchRequestConfig;
}

export interface GraphQLFetchParams<Result, Variables> {
  url: string;
  query: TypedDocumentString<Result, Variables>;
  variables?: Variables;
  cacheConfig?: CacheConfig;
}

export async function graphQLFetch<Result, Variables>({
  url,
  query,
  variables,
  cacheConfig,
}: GraphQLFetchParams<Result, Variables>): Promise<Result> {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query,
      variables,
    }),
    cache: cacheConfig?.cache,
    next: cacheConfig?.next ?? { revalidate: DEFAULT_REVALIDATION_TIME_S },
  });

  const result = (await response.json()) as GraphQLResponse<Result>;

  if ("errors" in result) {
    throw new Error(`CUSTOM ERROR - ${url} - ${result.errors[0].message}`);
  }

  return result.data;
}
