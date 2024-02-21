import { graphql } from "./graphql/generated";
import { graphQLFetch } from "./graphql/graphQLFetch";

export async function testFetch() {
  const query = graphql(`
    query Test {
      protocols(first: 5) {
        id
        configuratorProxy
        configuratorImplementation
        markets {
          id
        }
      }
      markets(first: 5) {
        id
        cometProxy
        protocol {
          id
        }
        creationBlockNumber
      }
    }
  `);

  const data = await graphQLFetch({
    url: `https://gateway-arbitrum.network.thegraph.com/api/${process.env.SUBGRAPH_API_KEY!}/subgraphs/id/5nwMCSHaTqG3Kd2gHznbTXEnZ9QNWsssQfbHhDqQSQFp`,
    query,
    cacheConfig: {
      next: {
        revalidate: 10,
      },
    },
  });

  console.log(data.protocols[0]);

  return data;
}
