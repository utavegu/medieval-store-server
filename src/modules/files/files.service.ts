import { HttpException, Injectable } from '@nestjs/common';
import {
  createDirectory,
  writeFile,
  deleteFile,
  removeDirectory,
} from 'src/helpers/fileSystem';
import { ID } from 'src/typing/types/id';
import { FileType } from './typespaces/enums/file-type.enum';

const UPLOADS_DIRECTORY = 'public/uploads';

@Injectable()
export class FilesService {
  async uploadFiles(
    fileType: FileType,
    unitId: ID,
    files: Express.Multer.File[],
  ) {
    try {
      const dirPath = `${UPLOADS_DIRECTORY}/${fileType}/${unitId}/`;
      createDirectory(dirPath);
      for (const file of files) {
        writeFile(dirPath, file);
      }
      return; // TODO: при необходимости буду возвращать пути, но пока её нет
    } catch (err) {
      throw new HttpException(err.message, err.status || 500);
    }
  }

  async deleteFile(fileType: FileType, unitId: ID, fileName: string) {
    try {
      const dirPath = `${UPLOADS_DIRECTORY}/${fileType}/${unitId}/${fileName}`;
      deleteFile(dirPath);
    } catch (err) {
      throw new HttpException(err.message, err.status || 500);
    }
  }

  async removeDirectory(fileType: FileType, unitId: ID) {
    try {
      const dirPath = `${UPLOADS_DIRECTORY}/${fileType}/${unitId}/`;
      removeDirectory(dirPath);
    } catch (err) {
      throw new HttpException(err.message, err.status || 500);
    }
  }
}
