import { SetMetadata } from '@nestjs/common';
import { Roles } from 'src/modules/users/typing/enums/roles.enum';

export const Role = (role: Roles) => SetMetadata('role', role);
