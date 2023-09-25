import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Schema as MongooseSchema } from 'mongoose';
import { ProductCategory } from './product-category.schema';

@Schema()
export class ProductType {
  @Prop({
    required: true,
    type: MongooseSchema.Types.ObjectId,
    ref: 'ProductCategory',
  })
  parentCategory: ProductCategory;

  @Prop({
    required: true,
    unique: true,
  })
  productTypeName: string;
}

export type ProductTypeDocument = ProductType & Document;

export const ProductTypeSchema = SchemaFactory.createForClass(ProductType);
