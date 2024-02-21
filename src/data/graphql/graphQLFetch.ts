import { GraphQLError } from "graphql";
import { TypedDocumentString } from "./generated/graphql";

type GraphQLResponse<Data> = { data: Data } | { errors: GraphQLError[] };

interface CacheConfig {
  cache?: RequestCache;
  next?: NextFetchRequestConfig;
}

interface GraphQLFetchParams<Result, Variables> {
  url: string;
  query: TypedDocumentString<Result, Variables>;
  cacheConfig?: CacheConfig;
}

export async function graphQLFetch<Result, Variables>({
  url,
  query,
  cacheConfig,
}: GraphQLFetchParams<Result, Variables>): Promise<Result> {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query,
    }),
    ...cacheConfig,
  });

  const result = (await response.json()) as GraphQLResponse<Result>;

  if ("errors" in result) {
    // TODO: handle
    throw new Error(result.errors[0].message);
  }

  return result.data;
}
