import { Controller, Get, Post, Body, Put, Param, Query } from '@nestjs/common';
import { CreateUserDto } from 'src/modules/users/typing/dto/create-user.dto';
import { User } from '../users/schemas/user.schema';
import { ID } from 'src/typing/types/id';
import { UsersService } from './users.service';
import { IdValidationPipe } from 'src/validation/id-validation.pipe';
import { IUsersData } from './typing/interfaces/IUsersData';
import { ISearchUserParams } from './typing/interfaces/ISearchUserParams';
import { UpdateUserDto } from './typing/dto/update-user.dto';

// TODO: Это тестовый контроллер для обкатки функционала админки. В дальнейшем методы юзер-сервиса будут раскиданы между модулями аутх, клиента, мэнэджера и админа, а контроллер будет удалён

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  // Админская и манагерская ручка
  @Get()
  fetchAllUsers(@Query() queryParams: ISearchUserParams): Promise<IUsersData> {
    return this.usersService.findAllUsers(queryParams);
  }

  // Админская и манагерская ручка
  @Get(':id')
  findUserById(
    @Param('id', IdValidationPipe) id: ID,
  ): Promise<Omit<User, 'passwordHash'>> {
    return this.usersService.findUserById(id);
  }

  // Ручка только для незалогиненных пользователей
  @Post()
  addUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.createUser(createUserDto);
  }

  // Ручка для залогиненного пользователя с айди равным тому, который редактируется
  @Put(':id')
  editUser(
    @Param('id', IdValidationPipe) id: ID,
    @Body() updateUserDto: UpdateUserDto, // Срабатывает быстрее, чем валидация id! Сначала заставит исправить все невалидные поля, а потом только скажет, что такого пользователя не существует
  ): Promise<Partial<User>> {
    return this.usersService.updateUser(id, updateUserDto);
  }
}
