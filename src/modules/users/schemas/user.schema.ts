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
    unique: false,
  })
  passwordHash: string;

  @Prop({
    required: true,
    unique: false,
  })
  firstName: string;

  @Prop({
    required: true,
    unique: false,
  })
  lastName: string;

  @Prop({
    required: false,
    unique: false,
  })
  isMale: boolean;

  @Prop({
    required: false,
    unique: false,
  })
  age: number;

  @Prop({
    required: false,
    unique: false,
  })
  contactPhone: string;

  @Prop({
    required: true,
    unique: false,
    default: Roles.CLIENT,
  })
  role: Roles;
}

export type UserDocument = User & Document;

export const UserSchema = SchemaFactory.createForClass(User);
