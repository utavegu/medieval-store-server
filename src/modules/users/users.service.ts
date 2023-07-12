import { Injectable } from '@nestjs/common';
import { IUserService } from './typing/interfaces/IUserService';
import { mockUsers } from 'src/mocks/mock-users';

@Injectable()
export class UsersService implements IUserService {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}

  findUserById(id: string): any {
    return mockUsers.find((user: { id: string }) => id === user.id);
  }
}
