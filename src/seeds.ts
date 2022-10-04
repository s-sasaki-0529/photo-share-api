export const createUsers = () => [
  {
    githubLogin: "A",
    name: "Aさん",
  },
  {
    githubLogin: "B",
    name: "Bさん",
  },
  {
    githubLogin: "C",
    name: "Cさん",
  },
];

export const createPhotos = () => [
  {
    id: 1,
    name: "Aさんの写真",
    description: "Aさんの写真の説明文",
    category: "ACTION",
    githubUser: "A",
    created: "3-28-1977",
  },
  {
    id: 2,
    name: "Bさんの写真",
    category: "SELFIE",
    githubUser: "B",
    created: "1-2-1985",
  },
  {
    id: 3,
    name: "Cさんの写真",
    description: "Cさんの写真の説明文",
    category: "LANDSCAPE",
    githubUser: "C",
    created: "2018-04-15T19:09:57.308Z",
  },
];

export const createTags = () => [
  { photoID: 1, userID: "A" },
  { photoID: 2, userID: "A" },
  { photoID: 2, userID: "B" },
  { photoID: 2, userID: "C" },
];
