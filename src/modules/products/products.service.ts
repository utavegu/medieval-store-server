import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from './schemas/product.schema';
import { ID } from 'src/typing/types/id';
import { CreateProductDto } from './typespaces/dto/create-product.dto';
import { IProductsService } from './typespaces/interfaces/IProductsService';

@Injectable()
export class ProductsService implements IProductsService {
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

  async getProductsByParams(params?: any): Promise<Product[]> {
    throw new Error('Method not implemented.');
  }

  async getProductById(id: ID): Promise<Product> {
    throw new Error('Method not implemented.');
  }

  async removeProduct(id: ID): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async editProduct(id: ID, data: Partial<Product>): Promise<Product> {
    throw new Error('Method not implemented.');
  }
}
