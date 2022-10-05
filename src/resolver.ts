import { GraphQLScalarType } from "graphql";
import { Db } from "mongodb";
import { authorizeWithGithub } from "./github";
import * as dotenv from "dotenv";

let _id = 100;
dotenv.config();

export const resolvers = {
  Query: {
    me: (parent, args, { currentUser }) => {
      return currentUser;
    },
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
    githubAuth: async (parent, args: { code: string }, context: { db: Db }) => {
      const { message, access_token, avatar_url, login, name } =
        await authorizeWithGithub({
          client_id: process.env.GITHUB_CLIENT_ID!,
          client_secret: process.env.GITHUB_CLIENT_SECRET!,
          code: args.code,
        });

      if (message) {
        throw new Error(message);
      }

      const latestUserInfo = {
        name,
        githubLogin: login,
        githubToken: access_token,
        avatar: avatar_url,
      };

      const ops = await context.db
        .collection("users")
        .replaceOne({ githubLogin: login }, latestUserInfo, { upsert: true });
      return { user: latestUserInfo, token: access_token };
    },
    postPhoto: async (parent, args, context: { currentUser; db: Db }) => {
      if (!context.currentUser) {
        throw new Error("only an authorized user can post a photo");
      }
      const newPhoto = {
        githubUser: context.currentUser.githubLogin,
        created: new Date(),
        ...args.input,
      };
      const { insertedId } = await context.db
        .collection("photos")
        .insertOne(newPhoto);
      newPhoto.id = insertedId;
      return newPhoto;
    },
  },
  Photo: {
    id: (parent) => parent.id || parent._id,
    url: (parent) => `http://yoursite.com/img/${parent._id}.jpg`,
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
