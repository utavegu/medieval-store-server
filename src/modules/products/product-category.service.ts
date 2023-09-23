import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  ProductCategory,
  ProductCategoryDocument,
} from './schemas/product-category.schema';
import { ID } from 'src/typing/types/id';

@Injectable()
export class ProductCategoryService {
  constructor(
    @InjectModel(ProductCategory.name)
    private ProductCategoryModel: Model<ProductCategoryDocument>,
  ) {}

  async addCategory(productCategoryName: string): Promise<ProductCategory> {
    try {
      return await this.ProductCategoryModel.create({ productCategoryName });
    } catch (err) {
      throw new HttpException(err.message, err.status || 500);
    }
  }

  async getAllCategories(): Promise<ProductCategory[]> {
    try {
      return await this.ProductCategoryModel.find();
    } catch (err) {
      throw new HttpException(err.message, err.status || 500);
    }
  }

  async removeCategory(id: ID): Promise<void> {
    try {
      await this.ProductCategoryModel.findByIdAndDelete(id);
      return;
    } catch (err) {
      throw new HttpException(err.message, err.status || 500);
    }
  }

  async renameCategory(
    id: ID,
    productCategoryName: string,
  ): Promise<ProductCategory | null> {
    try {
      return await this.ProductCategoryModel.findByIdAndUpdate(
        id,
        { productCategoryName },
        { new: true },
      );
    } catch (err) {
      throw new HttpException(err.message, err.status || 500);
    }
  }
}
