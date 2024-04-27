import type { CodegenConfig } from "@graphql-codegen/cli";
import { loadEnvConfig } from "@next/env";
import { GraphQLScalarType } from "graphql";
import { GraphQLBigInt, BigIntResolver } from "graphql-scalars";
loadEnvConfig(process.cwd());

// Paths relative to project root
const config: CodegenConfig = {
  overwrite: true,
  schema: `https://gateway-arbitrum.network.thegraph.com/api/${process.env.SUBGRAPH_API_KEY!}/subgraphs/id/5nwMCSHaTqG3Kd2gHznbTXEnZ9QNWsssQfbHhDqQSQFp`, // Just used to get schema
  documents: "src/data/**",
  generates: {
    "src/data/graphql/generated/": {
      preset: "client",
      config: {
        documentMode: "string",
        scalars: {
          BigDecimal: {
            input: "string",
            output: "string",
          },
          BigInt: {
            input: "string",
            output: "string",
          },
          Int8: {
            input: "any",
            output: "string",
          },
          Bytes: {
            input: "any",
            output: "string",
          },
        },
        mappers: {
          BigInt: "bigint",
        },
      },
    },
  },
};

export default config;
