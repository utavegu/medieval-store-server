import { IsString, IsMongoId } from 'class-validator';

export class CreateProductTypeDto {
  @IsMongoId()
  parentCategory: string;

  @IsString()
  productTypeName: string;
}
