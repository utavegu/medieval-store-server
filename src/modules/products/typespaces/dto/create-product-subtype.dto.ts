import { IsString, IsMongoId } from 'class-validator';

export class CreateProductSubtypeDto {
  @IsMongoId()
  parentType: string;

  @IsString()
  productSubtypeName: string;
}
