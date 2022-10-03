import { ApolloServer, Config } from "apollo-server";
import { ExpressContext } from "apollo-server-express";

let _id = 0;
const photos: Photo[] = [];

const typeDefs: Config<ExpressContext>["typeDefs"] = `
  type Photo {
    id: ID!
    url: String!
    name: String!
    description: String
  }

  type Query {
    totalPhotos: Int!
    allPhotos: [Photo!]!
  }

  type Mutation {
    postPhoto(name: String! description: String): Photo!
  }
`;

const resolvers: Config<ExpressContext>["resolvers"] = {
  Query: {
    totalPhotos: () => photos.length,
    allPhotos: () => photos,
  },
  Mutation: {
    postPhoto: (parent, args: Pick<Photo, "name" | "description">) => {
      const newPhoto: Photo = {
        id: _id++,
        url: "dummy",
        ...args,
      };
      photos.push(newPhoto);
      return newPhoto;
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.listen().then(({ url }) => {
  console.log(`GraphQL Service running on ${url}`);
});
