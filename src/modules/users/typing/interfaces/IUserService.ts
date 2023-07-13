import { ID } from 'src/typing/types/id';
import { User } from '../../schemas/user.schema';
// import { ISearchUserParams } from './ISearchUserParams';

export interface IUserService {
  createUser(data: Partial<User>): Promise<Partial<User>>;
  findUserById(id: ID): Promise<User | null>;
  findUserByEmail(email: User['email']): Promise<User | null>;
  findAllUsers(params: any): Promise<User[]>; // TODO: Параметры пока в разработке + или пустой массив
  updateUser(userEmail: User['email'], data: Partial<User>): Promise<User>;
}
