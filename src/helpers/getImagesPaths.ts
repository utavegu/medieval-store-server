export const getImagesPaths = (files: Express.Multer.File[]): string[] | [] => {
  if (files.length) {
    const images: string[] = [];
    files.forEach((file) => images.push(file.originalname));
    return images;
  }
  return [];
};
