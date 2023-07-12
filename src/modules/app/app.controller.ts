import { Controller, Get, Param } from '@nestjs/common';
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
  @Get('users/:userId')
  findTargetUser(@Param('userId') userId: ID): any {
    return this.usersService.findUserById(userId);
  }
}
