import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class ProductCategory {
  @Prop({
    required: true,
    unique: true,
  })
  productCategoryName: string;
}

export type ProductCategoryDocument = ProductCategory & Document;

export const ProductCategorySchema =
  SchemaFactory.createForClass(ProductCategory);
