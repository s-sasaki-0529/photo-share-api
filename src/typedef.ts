import { readFileSync } from "fs";

export const loadTypeDefs = () => {
  return readFileSync("./src/typedef.graphql", "utf-8").toString();
};
