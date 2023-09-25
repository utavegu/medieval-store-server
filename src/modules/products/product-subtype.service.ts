import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ID } from 'src/typing/types/id';
import {
  ProductSubtype,
  ProductSubtypeDocument,
} from './schemas/product-subtype.schema';
import { CreateProductSubtypeDto } from './typespaces/dto/create-product-subtype.dto';

@Injectable()
export class ProductSubtypeService {
  constructor(
    @InjectModel(ProductSubtype.name)
    private ProductSubtypeModel: Model<ProductSubtypeDocument>,
  ) {}

  async addProductSubtype(
    body: CreateProductSubtypeDto,
  ): Promise<ProductSubtype> {
    try {
      return await this.ProductSubtypeModel.create(body);
    } catch (err) {
      throw new HttpException(err.message, err.status || 500);
    }
  }

  async getAllProductSubtypesInType(
    parentType: ProductSubtype['parentType'],
  ): Promise<ProductSubtype[]> {
    try {
      return await this.ProductSubtypeModel.find({ parentType })
        .populate({
          path: 'parentType',
          select: 'productTypeName',
        })
        .select('-__v');
    } catch (err) {
      throw new HttpException(err.message, err.status || 500);
    }
  }

  async removeProductSubtype(id: ID): Promise<void> {
    try {
      await this.ProductSubtypeModel.findByIdAndDelete(id);
      return;
    } catch (err) {
      throw new HttpException(err.message, err.status || 500);
    }
  }

  async renameProductSubtype(
    id: ID,
    productSubtypeName: CreateProductSubtypeDto['productSubtypeName'],
  ): Promise<ProductSubtype | null> {
    try {
      return await this.ProductSubtypeModel.findByIdAndUpdate(
        id,
        { productSubtypeName },
        { new: true },
      );
    } catch (err) {
      throw new HttpException(err.message, err.status || 500);
    }
  }
}
