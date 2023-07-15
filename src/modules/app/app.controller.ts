import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/typing/dto/create-user.dto';
import { ID } from 'src/typing/types/id';
import { User } from '../users/schemas/user.schema';
import { IdValidationPipe } from 'src/validation/id-validation.pipe';

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

  @Post('users')
  createUser(@Body() createUserDto: CreateUserDto): Promise<string> {
    return this.usersService.createUser(createUserDto);
  }

  @Get('users/:id')
  findUserById(
    @Param('id', IdValidationPipe) id: ID,
  ): Promise<Omit<User, 'passwordHash'>> {
    return this.usersService.findUserById(id);
  }

  // @Get('test/:email')
  // findUserByEmail(
  //   @Param('email', ValidationPipe) email: CreateUserDto['email'],
  // ): Promise<User | null> {
  //   console.log(email);
  //   return this.usersService.findUserByEmail(email);
  // }
}
