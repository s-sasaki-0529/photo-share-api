import express from "express";
import { ApolloServer } from "apollo-server-express";
import expressPlayground from "graphql-playground-middleware-express";
import { loadTypeDefs } from "./src/typedef";
import { resolvers } from "./src/resolver";

// express サーバーのセットアップ
const app = express();
app.get("/", (req, res) => res.send("Welcome to the PhotoShare API"));
app.get("/playground", expressPlayground({ endpoint: "/graphql" }));
app.listen({ port: 4000 }, () => {
  console.log(
    `GraphQL Service running at http://localhost:4000${server.graphqlPath}`
  );
});

// graphql サーバーのセットアップ
const server = new ApolloServer({ typeDefs: loadTypeDefs(), resolvers });
server.start().then(() => {
  server.applyMiddleware({ app });
});
