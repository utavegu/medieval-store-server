import { IsString, IsMongoId, IsEnum } from 'class-validator';
import { FileType } from 'src/modules/files/typespaces/enums/file-type.enum';

export class removePhotoDto {
  @IsEnum(FileType)
  fileType: FileType;

  @IsString()
  fileName: string;
}
