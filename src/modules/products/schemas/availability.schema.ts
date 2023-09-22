import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId } from 'mongoose';
import { Schema as MongooseSchema } from 'mongoose';

@Schema()
export class ProductsAvailability {
  // @Prop({
  //   required: true,
  //   unique: true,
  //   type: MongooseSchema.Types.ObjectId,
  //   ref: 'Branch',
  // })
  // branch: ObjectId;

  // TODO: Пока нет филиалов для тестов будет просто строковое название филиала, вместо его id
  @Prop({
    required: true,
    unique: true,
  })
  branch: string;

  @Prop()
  quantityOfGoods: number; // только целые числа
}

export type ProductsAvailabilityDocument = ProductsAvailability & Document;

export const ProductsAvailabilitySchema =
  SchemaFactory.createForClass(ProductsAvailability);
