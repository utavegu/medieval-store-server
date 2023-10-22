import { SetMetadata } from '@nestjs/common';
import { Roles as possibleRoles } from 'src/modules/users/typing/enums/roles.enum';

export const RolesDecorator = (...roles: possibleRoles[]) =>
  SetMetadata('roles', roles);
