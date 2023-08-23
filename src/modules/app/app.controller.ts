import { Controller, Get, Param, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { UsersService } from '../users/users.service';
import { ID } from 'src/typing/types/id';
import { User } from '../users/schemas/user.schema';
import { IdValidationPipe } from 'src/validation/id-validation.pipe';
import { ISearchUserParams } from '../users/typing/interfaces/ISearchUserParams';
import {
  ResponseWithWrapper,
  responseWrapper,
} from 'src/helpers/responseWrapper';
import { IUsersData } from '../users/typing/interfaces/IUsersData';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly usersService: UsersService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  // TODO: Ниже - для тестов!

  /*
  @Get('users/:id')
  findUserById(
    @Param('id', IdValidationPipe) id: ID,
  ): Promise<Omit<User, 'passwordHash'>> {
    return this.usersService.findUserById(id);
  }
  */

  // TODO: роли - только манагеры и админы
  /* Чтобы не перехватывал модуль юзеров... но тут правильнее
  @Get('users')
  async fetchUsersForAdmin(
    @Query() queryParams: ISearchUserParams,
  ): Promise<ResponseWithWrapper> {
    const usersData: IUsersData = await this.usersService.findAllUsers(
      queryParams,
    );
    const test = responseWrapper(
      usersData.findedUsers,
      usersData.totalUsersCount,
    );
    return test;
  }
  */

  // @Get('test/:email')
  // findUserByEmail(
  //   @Param('email', ValidationPipe) email: CreateUserDto['email'],
  // ): Promise<User | null> {
  //   console.log(email);
  //   return this.usersService.findUserByEmail(email);
  // }
}
