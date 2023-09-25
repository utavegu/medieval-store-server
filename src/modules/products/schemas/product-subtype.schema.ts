import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Schema as MongooseSchema } from 'mongoose';
import { ProductType } from './product-type.schema';

@Schema()
export class ProductSubtype {
  @Prop({
    required: true,
    type: MongooseSchema.Types.ObjectId,
    ref: 'ProductType',
  })
  parentType: ProductType;

  @Prop({
    required: true,
    unique: true,
  })
  productSubtypeName: string;
}

export type ProductSubtypeDocument = ProductSubtype & Document;

export const ProductSubtypeSchema =
  SchemaFactory.createForClass(ProductSubtype);
