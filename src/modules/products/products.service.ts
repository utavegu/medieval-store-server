import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from './schemas/product.schema';
import { DEFAULT_LIMIT, DEFAULT_OFFSET } from 'src/constants';
import { ID } from 'src/typing/types/id';
import { CreateProductDto } from './typespaces/dto/create-product.dto';
import { IProductsService } from './typespaces/interfaces/IProductsService';
import { IProductsQueryParams } from './typespaces/interfaces/IProductsQueryParams';
import { IPriceRange } from './typespaces/interfaces/IPriceRange';
import { IProductsFilterParams } from './typespaces/interfaces/IProductsFilterParams';

@Injectable()
export class ProductsService implements IProductsService {
  constructor(
    @InjectModel(Product.name) private ProductModel: Model<ProductDocument>,
  ) {}

  async createProduct(body: CreateProductDto): Promise<Product> {
    try {
      return await (
        await (
          await (
            await this.ProductModel.create({
              ...body,
              price: Math.abs(Number(body.price)).toFixed(2),
            })
          ).populate({
            path: 'category',
            select: 'productCategoryName',
          })
        ).populate({
          path: 'type',
          select: 'productTypeName',
        })
      ).populate({
        path: 'subtype',
        select: 'productSubtypeName',
      });
    } catch (err) {
      throw new HttpException(err.message, err.status || 500);
    }
  }

  async getProductsByParams({
    limit = DEFAULT_LIMIT,
    offset = DEFAULT_OFFSET,
    productName,
    minPrice,
    maxPrice,
    category,
    type,
    subtype,
  }: IProductsQueryParams): Promise<Product[]> {
    try {
      const priceRange: IPriceRange = {};

      if (minPrice) priceRange['$gte'] = Number(minPrice);
      if (maxPrice) priceRange['$lte'] = Number(maxPrice);

      const productsFilterParams = {
        productName: productName && { $regex: productName },
        price: !!Object.keys(priceRange).length ? priceRange : undefined, // TODO: на фронтенде это двурычажковый рэндж
        category, // TODO: массив (но на фронте фильтр подкатегорий разворачивается в зависимости от чекбоксов выбранного типа - если категория выбрана только одна, откроются только её типы и так далее)
        type, // TODO: массив (определить в каком виде будет прилетать формдата с чекбоксов)
        subtype, // TODO: массив
      };

      for (const param in productsFilterParams) {
        const key = param as keyof IProductsFilterParams;
        if (!productsFilterParams[key]) {
          delete productsFilterParams[key];
        }
      }

      const products = await this.ProductModel.find(productsFilterParams)
        .limit(Math.abs(Number(limit)))
        .skip(Math.abs(Number(offset)))
        .select('-__v')
        .populate({
          path: 'category',
          select: 'productCategoryName',
        })
        .populate({
          path: 'type',
          select: 'productTypeName',
        })
        .populate({
          path: 'subtype',
          select: 'productSubtypeName',
        });
      return products;
    } catch (err) {
      throw new HttpException(err.message, err.status || 500);
    }
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
