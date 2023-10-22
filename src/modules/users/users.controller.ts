import { Controller, Get, Post, Body, Put, Param, Query } from '@nestjs/common';
import { CreateUserDto } from 'src/modules/users/typing/dto/create-user.dto';
import { User } from '../users/schemas/user.schema';
import { ID } from 'src/typing/types/id';
import { UsersService } from './users.service';
import { IdValidationPipe } from 'src/validation/id-validation.pipe';
import { IUsersData } from './typing/interfaces/IUsersData';
import { ISearchUserParams } from './typing/interfaces/ISearchUserParams';
import { UpdateUserDto } from './typing/dto/update-user.dto';

// TODO: Это тестовый контроллер для обкатки функционала админки. В дальнейшем методы юзер-сервиса будут раскиданы между модулями аутх, клиента, мэнэджера и админа, а контроллер будет удалён (хотя вот с такой логикой можно было и не добавлять мультиролевую гарду, но ладно уж, потренировался)

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  // Админская и манагерская ручка (но, получается, что роль будет всё равно только одна, раз будут разные контроллеры и урлы на доступ к ручке)
  @Get()
  fetchAllUsers(@Query() queryParams: ISearchUserParams): Promise<IUsersData> {
    return this.usersService.findAllUsers(queryParams);
  }

  // Админская и манагерская ручка (нет - любого авторизованного, айди извлекать из юзера... эмм... вообще зависит от того, для каких задач используется ручка)
  @Get(':id')
  findUserById(
    @Param('id', IdValidationPipe) id: ID,
  ): Promise<Omit<User, 'passwordHash'>> {
    return this.usersService.findUserById(id);
  }

  // Ручка только для незалогиненных пользователей (вообще такой ручки быть не должно, а сам метод из сервиса используется в ручке регистрации)
  @Post()
  addUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.createUser(createUserDto);
  }

  // Ручка для залогиненного пользователя с айди равным тому, который редактируется (нет - любого авторизованного, айди извлекать из юзера - тут, скорее будет зависеть от контекста - или пользователь редактирует сам себя из личного кабинета, или манагер редактирует его из админки)
  @Put(':id')
  editUser(
    @Param('id', IdValidationPipe) id: ID,
    @Body() updateUserDto: UpdateUserDto, // Срабатывает быстрее, чем валидация id! Сначала заставит исправить все невалидные поля, а потом только скажет, что такого пользователя не существует
  ): Promise<Partial<User>> {
    return this.usersService.updateUser(id, updateUserDto);
  }
}
