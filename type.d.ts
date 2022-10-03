type PhotoCategory = "SELFIE" | "PORTRAIT" | "ACTION" | "LANDSCAPE" | "GRAPHIC";

type Photo = {
  id: number;
  name: string;
  description?: string;
  category: PhotoCategory;
};

type PostPhotoInput = {
  name: string;
  description?: string;
  category: PhotoCategory;
};
