import { User } from '../../../users/schemas/user.schema';
import { ID } from 'src/typing/types/id';

export type UserWithId = Partial<User> & { id: ID };
