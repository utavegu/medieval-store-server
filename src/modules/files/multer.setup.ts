// import { diskStorage } from 'multer';
// import { extname } from 'path';
import {
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';

// const FORM_FIELD_NAME = 'photos'; // не универсальненько, вдруг что-то ещё загружать буду (это поле из формы с фронденда, которое перехватывается интерсептором для загрузки файлов)
const MAX_IMAGE_SIZE_IN_BYTES = 5000000; // 5Мб
const MAX_IMAGES_COUNT = 5;

const filesInterceptorSetup = {
  // Делегировал это сервису файлов для большей гибкости управления
  // storage: diskStorage({
  //   destination: './public/uploads/img',
  //   filename: (req, file, callback) => {
  //     const name = file.originalname.split('.')[0];
  //     const fileExtName = extname(file.originalname);
  //     callback(null, `${name}-${getRandomFileName()}${fileExtName}`);
  //   },
  // }),
  limits: {
    fileSize: MAX_IMAGE_SIZE_IN_BYTES, // дублируется в настройках нестового валидатора, использую оба, чтобы не забыть. Этот срабатывает первым! И, кстати, ошибки более информативные выбрасывает
    files: MAX_IMAGES_COUNT, // аналогично параметрам файл интерцептора, лишнее по сути. Оставляю, чтобы помнить о разных вариантах.
  },
  fileFilter: (
    _req: Request,
    file: Express.Multer.File,
    callback: (arg0: Error | null, arg1: boolean) => void,
  ) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/)) {
      return callback(new Error('Only image files are allowed!'), false); // TODO: Прокидывать так, чтобы перехватчик ошибок поймал
    }
    callback(null, true);
  },
};

// То же самое уже делает интерсептор выше, но оставляю оба способа, чтобы не забыть
const imageParseFilePipeInstance = new ParseFilePipe({
  fileIsRequired: false,
  validators: [
    new MaxFileSizeValidator({ maxSize: MAX_IMAGE_SIZE_IN_BYTES }),
    new FileTypeValidator({ fileType: /(jpg|jpeg|png|gif|webp)$/ }),
  ],
});

export {
  // FORM_FIELD_NAME,
  MAX_IMAGE_SIZE_IN_BYTES,
  MAX_IMAGES_COUNT,
  filesInterceptorSetup,
  imageParseFilePipeInstance,
};
