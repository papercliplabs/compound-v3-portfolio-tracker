import { GraphQLError } from "graphql";
import { TypedDocumentString } from "./generated/graphql";
import { UrlWithFallback } from "@/utils/configs";

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

export async function graphQLFetchWithFallback<Result, Variables>({
  urlWithFallback,
  ...params
}: Omit<GraphQLFetchParams<Result, Variables>, "url"> & {
  urlWithFallback: UrlWithFallback;
}): Promise<Result> {
  try {
    return await graphQLFetch({ url: urlWithFallback.primary, ...params });
  } catch (e) {
    if (urlWithFallback.fallback != undefined) {
      console.log("Graphql primary failed, trying fallback...", e);
      return await graphQLFetch({ url: urlWithFallback.fallback, ...params });
    } else {
      throw new Error(`Error with no fallback provided - ${e}`);
    }
  }
}
