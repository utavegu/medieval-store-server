import { User } from 'src/modules/users/schemas/user.schema';
import { ID } from 'src/typing/types/id';

// TODO: возможно ещё поле isActivated, но пока нет.
export interface JwtPayload {
  sub: ID;
  email: User['email'];
  role: User['role'];
  iat?: number;
  exp?: number;
}
