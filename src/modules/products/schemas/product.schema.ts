import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Schema as MongooseSchema } from 'mongoose';
import { ProductsAvailability } from './availability.schema';
import { ProductCategory } from './product-category.schema';
import { ProductType } from './product-type.schema';
import { ProductSubtype } from './product-subtype.schema';

@Schema()
export class Product {
  @Prop({
    required: true,
    unique: true,
  })
  productName: string;

  @Prop()
  description: string;

  @Prop({
    required: true,
  })
  price: number; // TODO: с плавающей точкой до двух символов

  @Prop()
  discount: number; // TODO: целое число от 0 до 100

  @Prop({
    required: true,
    type: [MongooseSchema.Types.ObjectId],
    ref: 'ProductCategory',
  })
  category: ProductCategory;

  @Prop({
    required: true,
    type: [MongooseSchema.Types.ObjectId],
    ref: 'ProductType',
  })
  type: ProductType;

  @Prop({
    type: [MongooseSchema.Types.ObjectId],
    ref: 'ProductSubtype',
  })
  subtype: ProductSubtype;

  @Prop({ default: [] })
  photos: [string];

  // Поле делаю необязательным, наличие проверять либо по длине массива, либо пробегаться по его объектам и смотреть каунт
  @Prop({
    type: [MongooseSchema.Types.ObjectId],
    ref: 'ProductsAvailability',
  })
  productsAvailability: [ProductsAvailability];

  @Prop({
    required: true,
    default: new Date().toISOString(),
  })
  createdAt: Date;

  @Prop()
  updatedAt: Date;

  // возможно объектом тут не надо
  // specifications: {
  //   weight: number;
  //   color: [string];
  //   materials: [string];
  // };
}

export type ProductDocument = Product & Document;

export const ProductSchema = SchemaFactory.createForClass(Product);
