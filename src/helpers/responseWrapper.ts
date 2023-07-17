import { Statuses } from 'src/typing/enums/statuses.enum';

export type ResponseWithWrapper = {
  status: Statuses.SUCCESS;
  data: any;
  count?: number;
};

export const responseWrapper = (
  data: any,
  count: number,
): ResponseWithWrapper => {
  const responseWrapper: ResponseWithWrapper = {
    status: Statuses.SUCCESS,
    data: data,
  };

  if (Array.isArray(data)) {
    responseWrapper.count = count;
  }

  return responseWrapper;
};
