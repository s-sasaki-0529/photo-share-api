import { Db, MongoClient } from "mongodb";
import { createPhotos, createTags, createUsers } from "./seeds";

const DB_HOST = "mongodb://localhost:27017/photo-share";

export const connectMongoDb = async () => {
  const client = await MongoClient.connect(DB_HOST);
  const db = client.db();
  return db;
};

export const seedToMongoDb = async () => {
  const db = await connectMongoDb();

  await db.collection("users").deleteMany({});
  await db.collection("photos").deleteMany({});
  await db.collection("tags").deleteMany({});

  await db.collection("photos").insertMany(createPhotos());
  await db.collection("users").insertMany(createUsers());
  await db.collection("tags").insertMany(createTags());
};
