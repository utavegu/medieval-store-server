import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { UsersService } from '../users/users.service';
import { ID } from 'src/typing/types/id';

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

  // TODO: Для тестов!

  @Post('users')
  createUser(@Body() body: any): any {
    return this.usersService.createUser(body);
  }

  // @Get('users/:userId')
  // findTargetUserById(@Param('userId') userId: ID): any {
  //   return this.usersService.findUserById(userId);
  // }

  // совсем порнография - просто для тестов
  @Get('users/:userEmail')
  findTargetUserByEmail(@Param('userId') userEmail: any): any {
    return this.usersService.findUserByEmail(userEmail);
  }
}
