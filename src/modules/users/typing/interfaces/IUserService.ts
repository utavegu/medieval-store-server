import { ID } from 'src/typing/types/id';
// import { User } from '../../schemas/user.schema';
// import { ISearchUserParams } from './ISearchUserParams';

export interface IUserService {
  // createUser(data: Partial<any>): Promise<Partial<any>>;
  findUserById(id: ID): Promise<any>;
  // findUserByEmail(email: string): Promise<any>;
  // findAllUsers(params: any): Promise<any[]>;
  // updateUser(userEmail: any, data: any): Promise<any>;
}
