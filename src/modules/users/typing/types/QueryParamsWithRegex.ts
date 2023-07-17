import { ISearchUserParams } from '../interfaces/ISearchUserParams';

export type QueryParamsWithRegex = {
  email?: { $regex: ISearchUserParams['email'] };
  firstName?: { $regex: ISearchUserParams['firstName'] };
  contactPhone?: { $regex: ISearchUserParams['contactPhone'] };
};
