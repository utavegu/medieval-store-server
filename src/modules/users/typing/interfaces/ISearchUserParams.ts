import { IsNumberString, IsOptional } from 'class-validator';

export class ISearchUserParams {
  @IsNumberString()
  // @IsPositive()
  @IsOptional()
  limit?: number;

  @IsNumberString()
  @IsOptional()
  // @IsPositive()
  offset?: number;

  email?: string;

  firstName?: string;

  contactPhone?: string;
}
