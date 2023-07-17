import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { ID } from 'src/typing/types/id';
import { IUserService } from './typing/interfaces/IUserService';
import { DEFAULT_LIMIT, DEFAULT_OFFSET, ERROR_MESSAGES } from 'src/constants';
import { CreateUserDto } from './typing/dto/create-user.dto';
import { encryptPassword } from 'src/helpers/encrypting';
import { ISearchUserParams } from './typing/interfaces/ISearchUserParams';
import { QueryParamsWithRegex } from './typing/types/QueryParamsWithRegex';
import { ConfigurableSearchUserParams } from './typing/types/ConfigurableSearchUserParams';
import { IUsersData } from './typing/interfaces/IUsersData';

@Injectable()
export class UsersService implements IUserService {
  constructor(@InjectModel(User.name) private UserModel: Model<UserDocument>) {}

  public async createUser(body: CreateUserDto): Promise<string> {
    /*
    TODO:
    - различные проверки (подумай, какие ещё нужны)
    - выбрасывание ошибок на разные кейсы (валидатор и монгуз вроде все обработали, но посмотри ещё тестовые кейсы)
    - ограничения (нужны ли ещё какие-то ограничения валидации?)
    */
    try {
      const { password, ...other } = body;
      const passwordHash = await encryptPassword(password);
      const newUser = await this.UserModel.create({
        ...other,
        passwordHash,
      });
      return `Новый пользователь ${newUser.lastName} ${newUser.firstName} успешно зарегистрирован!`;
    } catch (err) {
      throw new HttpException(err.message, err.status || 500);
    }
  }

  public async findUserById(id: ID): Promise<User> {
    try {
      const user = await this.UserModel.findById(id).select(
        '-__v -passwordHash',
      );
      if (user) {
        return user;
      } else {
        throw new NotFoundException(ERROR_MESSAGES.USER_IS_NOT_REGISTERED);
      }
    } catch (err) {
      console.error(err);
      throw new HttpException(err.message, err.status || 500);
    }
  }

  async findAllUsers(params?: ISearchUserParams): Promise<IUsersData> {
    try {
      const limit = params?.limit
        ? Math.abs(Number(params.limit))
        : DEFAULT_LIMIT;
      const offset = params?.offset
        ? Math.abs(Number(params.offset))
        : DEFAULT_OFFSET;

      const otherQueryParams: QueryParamsWithRegex = {};

      for (const param in params) {
        const key = param as keyof ConfigurableSearchUserParams;
        if (param === 'limit' || param === 'offset') continue;
        otherQueryParams[key] = { $regex: params[key] };
      }

      const findedUsers = await this.UserModel.find(otherQueryParams)
        .limit(limit)
        .skip(offset)
        .select('-__v -passwordHash -role');

      const totalUsersCount = await this.UserModel.count();

      return {
        findedUsers,
        totalUsersCount,
      };
    } catch (err) {
      throw new HttpException(err.message, err.status);
    }
  }

  /*
  public async findUserByEmail(email: User['email']): Promise<User | any> {
    try {
      const user = await this.UserModel.findOne({ email }).select(
        '-__v -passwordHash',
      );
      if (user) {
        return user;
      } else {
        throw new NotFoundException(ERROR_MESSAGES.USER_IS_NOT_REGISTERED);
      }
    } catch (err) {
      console.error(err);
      throw new HttpException(err.message, err.status || 500);
    }
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
  */
}
