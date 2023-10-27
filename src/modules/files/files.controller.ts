import { Controller, Get, Param, Response } from '@nestjs/common';
import { Response as ResponseType } from 'express';

@Controller()
export class FilesController {
  @Get('file/:productId/:imageFullName')
  getUploadedProductPhoto(
    @Param('productId') productId: string,
    @Param('imageFullName') imageFullName: string,
    @Response() response: ResponseType,
  ) {
    return response.sendFile(`${productId}/${imageFullName}`, {
      root: './public/uploads/img',
    });
  }
}
