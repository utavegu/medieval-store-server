import {
  IsString,
  IsInt,
  Length,
  Min,
  Max,
  IsOptional,
  IsMongoId,
  IsArray,
  IsNumberString,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @Length(2, 30)
  productName: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumberString()
  price: string;

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
