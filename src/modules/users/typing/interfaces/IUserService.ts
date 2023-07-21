import { ID } from 'src/typing/types/id';
import { User } from '../../schemas/user.schema';
import { ISearchUserParams } from './ISearchUserParams';
import { IUsersData } from './IUsersData';

export interface IUserService {
  createUser(data: Partial<User>): Promise<User>; // Partial -> DTO
  // только админы и манагеры
  findUserById(id: ID): Promise<Omit<User, 'passwordHash'>>;
  // только админы и манагеры
  findUserByEmail(email: User['email']): Promise<Omit<User, 'passwordHash'>>;
  // только админы и манагеры
  findAllUsers(params?: ISearchUserParams): Promise<IUsersData>;
  // только залогиненный пользователь себя самого
  updateUser(id: ID, data: Partial<User>): Promise<User>; // Partial -> DTO
}
