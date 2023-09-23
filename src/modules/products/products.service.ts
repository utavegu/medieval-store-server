import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from './schemas/product.schema';
import { CreateProductDto } from './typespaces/dto/create-product.dto';

// TODO: имплементиться от айПродуктСервиса
@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private ProductModel: Model<ProductDocument>,
  ) {}

  async createProduct(body: CreateProductDto): Promise<Product> {
    try {
      return await this.ProductModel.create(body);
    } catch (err) {
      throw new HttpException(err.message, err.status || 500);
    }
  }
}
