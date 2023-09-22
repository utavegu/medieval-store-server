import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from './schemas/product.schema';

// TODO: имплементиться от айПродуктСервиса
@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private ProductModel: Model<ProductDocument>,
  ) {}

  // TODO: createProductDto (с валидацией)
  async createProduct(body: any): Promise<Product> {
    try {
      return await this.ProductModel.create(body);
    } catch (err) {
      throw new HttpException(err.message, err.status || 500);
    }
  }
}
