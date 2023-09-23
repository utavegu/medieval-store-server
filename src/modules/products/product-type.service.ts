import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ID } from 'src/typing/types/id';
import {
  ProductType,
  ProductTypeDocument,
} from './schemas/product-type.schema';
import { CreateProductTypeDto } from './typespaces/dto/create-product-type.dto';

// TODO: эта повторяющаяся обёртка из трай-кэтча прямо напрашивается на отдельную функцию... только вот что-то не уверен, что получится нормально ей скормить модель, но попробовать надо. Но и, опять-таки, там не везде простой ретурн, могут быть другие блоки кода и т.д.

@Injectable()
export class ProductTypeService {
  constructor(
    @InjectModel(ProductType.name)
    private ProductTypeModel: Model<ProductTypeDocument>,
  ) {}

  async addProductType(body: CreateProductTypeDto): Promise<ProductType> {
    try {
      return await this.ProductTypeModel.create(body);
    } catch (err) {
      throw new HttpException(err.message, err.status || 500);
    }
  }

  async getAllProductTypes(): Promise<ProductType[]> {
    try {
      return await this.ProductTypeModel.find()
        .populate({
          path: 'parentCategory',
          select: 'productCategoryName',
        })
        .select('-__v');
    } catch (err) {
      throw new HttpException(err.message, err.status || 500);
    }
  }

  async removeProductType(id: ID): Promise<void> {
    try {
      await this.ProductTypeModel.findByIdAndDelete(id);
      return;
    } catch (err) {
      throw new HttpException(err.message, err.status || 500);
    }
  }

  async renameProductType(
    id: ID,
    productTypeName: CreateProductTypeDto['productTypeName'],
  ): Promise<ProductType | null> {
    try {
      return await this.ProductTypeModel.findByIdAndUpdate(
        id,
        { productTypeName },
        { new: true },
      );
    } catch (err) {
      throw new HttpException(err.message, err.status || 500);
    }
  }
}
