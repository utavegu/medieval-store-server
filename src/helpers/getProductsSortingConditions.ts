import { HttpException } from '@nestjs/common';
import { SortingType } from 'src/modules/products/typespaces/enums/sorting-type.enum';

export const getProductsSortingConditions = (sortingType: SortingType) => {
  switch (sortingType) {
    case 'nameAsc':
      return { productName: 'asc' };
    case 'nameDesc':
      return { productName: 'desc' };
    case 'priceAsc':
      return { price: 'asc' };
    case 'priceDesc':
      return { price: 'desc' };
    default:
      throw new HttpException('Неверное значение типа сортировки!', 400);
  }
};
