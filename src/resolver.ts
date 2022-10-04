import { GraphQLScalarType } from "graphql";
import { createPhotos, createTags, createUsers } from "./seeds";

let _id = 0;
const users = createUsers();
const photos: any[] = createPhotos();
const tags = createTags();

export const resolvers = {
  Query: {
    totalPhotos: () => photos.length,
    allPhotos: (parent, args) => {
      if (args.after) {
        return photos.filter((p) => new Date(p.created) > args.after);
      } else {
        return photos;
      }
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
