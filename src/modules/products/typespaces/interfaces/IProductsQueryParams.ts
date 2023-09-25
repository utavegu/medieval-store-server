import { IsNumberString, IsOptional, IsString } from 'class-validator';

export class IProductsQueryParams {
  @IsNumberString()
  // @IsPositive()
  @IsOptional()
  limit?: number | string; // Все квери-параметры приходят как стринга! Возможно следует принять этот факт и не извращаться, но тогда проверять на нумерик стринг или как он там правильно....

  @IsNumberString()
  @IsOptional()
  // @IsPositive()
  offset?: number | string;

  @IsString()
  @IsOptional()
  productName?: string;

  @IsNumberString()
  @IsOptional()
  minPrice?: number | string;

  @IsNumberString()
  @IsOptional()
  maxPrice?: number | string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsString()
  @IsOptional()
  type?: string;

  @IsString()
  @IsOptional()
  subtype?: string;
}
