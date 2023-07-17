import { ID } from 'src/typing/types/id';
import { User } from '../../schemas/user.schema';
import { ISearchUserParams } from './ISearchUserParams';
import { IUsersData } from './IUsersData';
// import { ISearchUserParams } from './ISearchUserParams';

export interface IUserService {
  createUser(data: Partial<User>): Promise<string>;
  findUserById(id: ID): Promise<Omit<User, 'passwordHash'>>;
  // findUserByEmail(email: User['email']): Promise<Omit<User, 'passwordHash'>>;
  findAllUsers(params?: ISearchUserParams): Promise<IUsersData>;
  // updateUser(userEmail: User['email'], data: Partial<User>): Promise<User>;
}
