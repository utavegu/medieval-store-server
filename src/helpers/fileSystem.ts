import { mkdirSync, existsSync, writeFileSync, unlinkSync } from 'fs';

const createDirectory = (dirPath: string) => {
  if (!existsSync(dirPath)) {
    mkdirSync(dirPath, { recursive: true });
  }
};

const writeFile = (dirPath: string, file: Express.Multer.File) => {
  const fullPath = dirPath + file.originalname;
  if (!existsSync(fullPath)) {
    if (file.mimetype.includes('image')) {
      // TODO: вот тут добавить переконвертирование файла в вебпи и ужимание его качества. Может sharp, может не sharp
      writeFileSync(fullPath, file.buffer);
    } else {
      writeFileSync(fullPath, file.buffer);
    }
  }
};

const deleteFile = (path: string) => {
  if (existsSync(path)) {
    unlinkSync(path);
  }
};

export { createDirectory, writeFile, deleteFile };
