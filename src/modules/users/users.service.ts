import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { ID } from 'src/typing/types/id';
import { IUserService } from './typing/interfaces/IUserService';

@Injectable()
export class UsersService implements IUserService {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor(@InjectModel(User.name) private UserModel: Model<UserDocument>) {}

  // TODO: По хорошему create user dto должен получать
  public async createUser(body: Partial<User>): Promise<Partial<User>> {
    // Пока просто для теста. Тут ещё очень много делов по хэшированию пароля, возврата только нужных полей, различных проверок и выбрасываемых ошибок (с их расшифровкой), подключением класс-валидатора и выставления ограничений на создание...
    return await this.UserModel.create(body);
  }

  public async findUserById(id: ID): Promise<User | null> {
    const user = await this.UserModel.findById(id).select('-__v -passwordHash');
    console.log(user);
    return user;
  }

  public async findUserByEmail(email: User['email']): Promise<User | null> {
    const user = await this.UserModel.findOne({ email }).select(
      '-__v -passwordHash',
    );
    console.log(user);
    return user;
  }

  // TODO: Эти параметры - пока думаю
  public async findAllUsers(params: any): Promise<User[]> {
    throw new Error('Method not implemented.');
  }

  // TODO: а тут update user dto
  public async updateUser(
    userEmail: string,
    data: Partial<User>,
  ): Promise<User> {
    throw new Error('Method not implemented.');
  }
}
