import { ApolloServer, Config } from "apollo-server";
import { ExpressContext } from "apollo-server-express";
import { createPhotos, createUsers } from "./src/seeds";

let _id = 0;
const users = createUsers();
const photos: any[] = createPhotos();

const typeDefs: Config<ExpressContext>["typeDefs"] = `
  enum PhotoCategory {
    SELFIE
    PORTRAIT
    ACTION
    LANDSCAPE
    GRAPHIC
  }

  input PostPhotoInput {
    name: String!
    description: String
    category: PhotoCategory=PORTRAIT
  }

  type User {
    githubLogin: ID!
    name: String
    avatar: String
    postedPhotos: [Photo!]!
  }

  type Photo {
    id: ID!
    url: String!
    name: String!
    description: String
    category: PhotoCategory
    postedBy: User!
  }

  type Query {
    totalPhotos: Int!
    allPhotos: [Photo!]!
    allUsers: [User!]!
  }

  type Mutation {
    postPhoto(input: PostPhotoInput!): Photo!
  }
`;

const resolvers: Config<ExpressContext>["resolvers"] = {
  Query: {
    totalPhotos: () => photos.length,
    allPhotos: () => photos,
    allUsers: () => users,
  },
  Mutation: {
    postPhoto: (parent, args) => {
      const newPhoto = {
        id: _id++,
        ...args.input,
      };
      photos.push(newPhoto);
      return newPhoto;
    },
  },
  Photo: {
    url: (parent) => `http://yoursite.com/img/${parent.id}.jpg`,
    postedBy: (parent) => {
      return users.find((u) => u.githubLogin === parent.githubUser);
    },
  },
  User: {
    postedPhotos: (parent) => {
      return photos.filter((p) => p.githubUser === parent.githubLogin);
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
