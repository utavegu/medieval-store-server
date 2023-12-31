import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import * as uuid from 'uuid';
import { InjectModel } from '@nestjs/mongoose';
import { MailService } from '../mail/mail.service';
import { User, UserDocument } from './schemas/user.schema';
import { ID } from 'src/typing/types/id';
import { IUserService } from './typing/interfaces/IUserService';
import { DEFAULT_LIMIT, DEFAULT_OFFSET, ERROR_MESSAGES } from 'src/constants';
import { CreateUserDto } from './typing/dto/create-user.dto';
import { UpdateUserDto } from './typing/dto/update-user.dto';
import { encryptPassword } from 'src/helpers/encrypting';
import { ISearchUserParams } from './typing/interfaces/ISearchUserParams';
import { QueryParamsWithRegex } from './typing/types/QueryParamsWithRegex';
import { ConfigurableSearchUserParams } from './typing/types/ConfigurableSearchUserParams';
import { IUsersData } from './typing/interfaces/IUsersData';

@Injectable()
export class UsersService implements IUserService {
  constructor(
    @InjectModel(User.name) private UserModel: Model<UserDocument>,
    private mailService: MailService,
  ) {}

  async createUser(body: CreateUserDto): Promise<User> {
    /*
    TODO:
    - различные проверки (подумай, какие ещё нужны)
    - выбрасывание ошибок на разные кейсы (валидатор и монгуз вроде все обработали, но посмотри ещё тестовые кейсы)
    - ограничения (нужны ли ещё какие-то ограничения валидации?)
    - проверяю, что пользователь зарегистрирован? Да: "E11000 duplicate key error collection: medieval-store.users index: email_1 dup key: { email: \"test@mail.ru\" }"
    */
    try {
      const { password, ...other } = body;
      const passwordHash = await encryptPassword(password);
      const activationLink = uuid.v4();
      const newUser = await this.UserModel.create({
        ...other,
        passwordHash,
        activationLink,
      });
      await this.mailService.sendActivationMail(
        body.email,
        `http://localhost:${process.env.SERVER_EXTERNAL_PORT}/api/auth/activate/${activationLink}`,
      );
      return newUser;
    } catch (err) {
      throw new HttpException(err.message, err.status || 500);
    }
  }

  async findUserById(id: ID): Promise<User> {
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

  async findUserByEmail(email: User['email']): Promise<User> {
    try {
      const user = await this.UserModel.findOne({ email }).select('-__v');
      // TODO: DRY!
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

  async updateUser(id: ID, data: UpdateUserDto): Promise<User> {
    // TODO: DRY
    try {
      const user = await this.UserModel.findByIdAndUpdate(id, data, {
        new: true,
      }).select('-__v -passwordHash -role -_id');
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

  async activateUserProfile(activationLink: string): Promise<void> {
    try {
      const user = await this.UserModel.findOne({ activationLink });
      if (!user || user.activationLink !== activationLink) {
        throw new HttpException(
          'Некорректная ссылка активации', // TODO - в константы
          HttpStatus.BAD_REQUEST,
        );
      }
      await this.UserModel.findByIdAndUpdate(user._id, {
        isActivated: true,
      });
      return;
    } catch (error) {
      throw new HttpException(error.message, error.status || 500);
    }
  }
}
