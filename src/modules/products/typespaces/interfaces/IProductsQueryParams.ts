import { IsNumberString, IsOptional, IsString, IsEnum } from 'class-validator';
import { SortingType } from '../enums/sorting-type.enum';

// TODO: Добавить ещё массив - материалы. Всего должны быть реализованы поиск по параметрам: строка - нечто из названия или описания продукта, совпадения; диапазон минимальной и максимальной цены; массив интересующих материалов, сортировка - 4 вида

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

  @IsEnum(SortingType)
  sort: SortingType;
}
