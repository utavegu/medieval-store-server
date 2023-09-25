export const getImagesPaths = (files: Express.Multer.File[]): string[] | [] => {
  if (files.length) {
    const images: string[] = [];
    files.forEach((file) => images.push(`/img/${file.filename}`));
    return images;
  }
  return [];
};
