import {
  IsString,
  IsInt,
  Length,
  Min,
  Max,
  IsOptional,
  IsNumber,
  IsMongoId,
  IsArray,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @Length(2, 30)
  productName: string;

  @IsString()
  @IsOptional()
  description?: string;

  // TODO: с плавающей точкой до двух символов - проверь, что работает валидация
  @IsNumber({ maxDecimalPlaces: 2 })
  price: number;

  @IsInt()
  @Min(0)
  @Max(100)
  @IsOptional()
  discount?: number;

  @IsMongoId()
  category: string;

  @IsMongoId()
  type: string;

  @IsMongoId()
  @IsOptional()
  subtype?: string;

  @IsArray()
  @IsOptional()
  photos?: string[];

  @IsArray()
  @IsOptional()
  productsAvailability?: string[];
}
