import type { CodegenConfig } from "@graphql-codegen/cli";
import { loadEnvConfig } from "@next/env";
loadEnvConfig(process.cwd());

// Paths relative to project root
const config: CodegenConfig = {
  overwrite: true,
  schema: `https://gateway-arbitrum.network.thegraph.com/api/${process.env.SUBGRAPH_API_KEY!}/deployments/id/Qma9vGcUHz6pUeRTcHzU64yuS4i4dBxKh3TKKrXY3ckNas`, // Just used to get schema
  // schema: `http://192.168.1.64:8000/subgraphs/name/papercliplabs/compound-v3-local`,
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
