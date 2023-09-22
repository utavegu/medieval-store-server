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
    enum: Roles,
    default: Roles.CLIENT,
  })
  role: Roles;

  // TODO: что за ошибка с типом, почему? Из-за того, что null еще возможен?
  // TODO: Сделать поле не строкой, а массивом объектов, где также будут поля айпи-адрес, устройство и браузер (фингерпринт браузера).
  // TODO: Совсем по хорошему - токены должна быть отдельная модель, связанная через ID пользователя с моделью юзера (где сам токен - обязательная строка)
  // user: {type: Schema.Types.ObjectId, ref: 'User'}
  @Prop({
    type: 'string',
  })
  refreshToken: string | null;

  @Prop({
    default: false,
  })
  isActivated: boolean;

  @Prop()
  activationLink: string;
}

/*
TODO: Ещё неплохо бы добавить дату-время регистрации и дату-время активации профиля. Первое точно можно автоматически создавать.
@Prop({ required: true, default: new Date() })
public createAt: Date;
*/

export type UserDocument = User & Document;

export const UserSchema = SchemaFactory.createForClass(User);
