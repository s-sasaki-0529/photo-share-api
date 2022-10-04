import { GraphQLScalarType } from "graphql";
import { Db } from "mongodb";

let _id = 100;

export const resolvers = {
  Query: {
    totalPhotos: (parent, args, { db }) => {
      return db.collection("photos").estimatedDocumentCount();
    },
    allPhotos: async (parent, args, { db }) => {
      const photos = await db.collection("photos").find().toArray();
      if (args.after) {
        return photos.filter((p) => new Date(p.created) > args.after);
      } else {
        return photos;
      }
    },
    allUsers: async (parent, args, { db }) => {
      return db.collection("users").find().toArray();
    },
  },
  Mutation: {
    postPhoto: async (parent, args, context: { db: Db }) => {
      const newPhoto = {
        id: _id++,
        githubUser: "C",
        created: new Date(),
        ...args.input,
      };
      await context.db.collection("photos").insertOne(newPhoto);
      return newPhoto;
    },
  },
  Photo: {
    url: (parent) => `http://yoursite.com/img/${parent.id}.jpg`,
    postedBy: async (parent, args, { db }) => {
      return db.collection("users").findOne({ githubLogin: parent.githubUser });
    },
    taggedUsers: async (parent, args, context: { db: Db }) => {
      const tags = await context.db
        .collection("tags")
        .find({ photoID: parent.id })
        .toArray();
      const userIds = tags.map((t) => t.userID);
      return context.db
        .collection("users")
        .find({ githubLogin: { $in: userIds } })
        .toArray();
    },
  },
  User: {
    postedPhotos: async (parent, args, { db }) => {
      return db
        .collection("photos")
        .find({ githubUser: parent.githubLogin })
        .toArray();
    },
    inPhotos: async (parent, args, context: { db: Db }) => {
      const photos = await context.db
        .collection("tags")
        .find({ userID: parent.githubLogin })
        .toArray();
      const photoIds = photos.map((p) => p.photoID);
      return context.db
        .collection("photos")
        .find({ id: { $in: photoIds } })
        .toArray();
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
