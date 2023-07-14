import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Roles } from '../typing/enums/roles.enum';

@Schema()
export class User {
  @Prop({
    required: true,
    unique: true,
  })
  email: string;

  @Prop({
    required: true,
  })
  passwordHash: string;

  @Prop({
    required: true,
  })
  firstName: string;

  @Prop({
    required: true,
  })
  lastName: string;

  @Prop()
  isMale: boolean;

  @Prop()
  age: number;

  @Prop()
  contactPhone: string;

  @Prop({
    required: true,
    default: Roles.CLIENT,
  })
  role: Roles;
}

export type UserDocument = User & Document;

export const UserSchema = SchemaFactory.createForClass(User);