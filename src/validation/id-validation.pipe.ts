import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { Types } from 'mongoose';
import { ERROR_MESSAGES } from 'src/constants';

@Injectable()
export class IdValidationPipe implements PipeTransform {
  transform(value: Types.ObjectId) {
    if (Types.ObjectId.isValid(value)) return value;
    throw new BadRequestException(ERROR_MESSAGES.IS_NOT_ID);
  }
}
