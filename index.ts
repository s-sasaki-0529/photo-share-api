import { ApolloServer, Config } from "apollo-server";
import { ExpressContext } from "apollo-server-express";

const typeDefs: Config<ExpressContext>["typeDefs"] = `
  type Query {
    totalPhotos: Int!
  }
`;

const resolvers: Config<ExpressContext>["resolvers"] = {
  Query: {
    totalPhotos: () => 42,
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.listen().then(({ url }) => {
  console.log(`GraphQL Service running on ${url}`);
});
