import { User } from '../../schemas/user.schema';

export interface IUsersData {
  findedUsers: User[];
  totalUsersCount: number;
}
