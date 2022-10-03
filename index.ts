import { ApolloServer, Config } from "apollo-server";
import { ExpressContext } from "apollo-server-express";
import { createPhotos, createTags, createUsers } from "./src/seeds";
import { GraphQLScalarType } from "graphql";

let _id = 0;
const users = createUsers();
const photos: any[] = createPhotos();
const tags = createTags();

const typeDefs: Config<ExpressContext>["typeDefs"] = `
  scalar DateTime

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
    inPhotos: [Photo!]!
  }

  type Photo {
    id: ID!
    url: String!
    name: String!
    description: String
    category: PhotoCategory
    postedBy: User!
    taggedUsers: [User!]!
    created: DateTime!
  }

  type Query {
    totalPhotos: Int!
    allPhotos(after: DateTime): [Photo!]!
    allUsers: [User!]!
  }

  type Mutation {
    postPhoto(input: PostPhotoInput!): Photo!
  }
`;

const resolvers: Config<ExpressContext>["resolvers"] = {
  Query: {
    totalPhotos: () => photos.length,
    allPhotos: (parent, args) => {
      return photos.filter((p) => new Date(p.created) > args.after);
    },
    allUsers: () => users,
  },
  Mutation: {
    postPhoto: (parent, args) => {
      const newPhoto = {
        id: _id++,
        githubUser: args.input.name,
        created: new Date(),
        ...args.input,
      };
      photos.push(newPhoto);
      console.log(photos);
      return newPhoto;
    },
  },
  Photo: {
    url: (parent) => `http://yoursite.com/img/${parent.id}.jpg`,
    postedBy: (parent) => {
      return users.find((u) => u.githubLogin === parent.githubUser);
    },
    taggedUsers: (parent) => {
      return tags
        .filter((t) => t.photoID === parent.id)
        .map((t) => users.find((u) => u.githubLogin === t.userID));
    },
  },
  User: {
    postedPhotos: (parent) => {
      return photos.filter((p) => p.githubUser === parent.githubLogin);
    },
    inPhotos: (parent) => {
      return tags
        .filter((t) => t.userID === parent.githubLogin)
        .map((t) => photos.find((p) => p.id === t.photoID));
    },
  },
  DateTime: new GraphQLScalarType({
    name: "DateTime",
    description: "A valid date time value.",
    parseValue: (value: any) => new Date(value),
    serialize: (value: any) => new Date(value).toISOString(),
    parseLiteral: (ast: any) => ast.value,
  }),
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.listen().then(({ url }) => {
  console.log(`GraphQL Service running on ${url}`);
});
