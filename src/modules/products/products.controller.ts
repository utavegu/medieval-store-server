import { Body, Controller, Post } from '@nestjs/common';
import { ProductsService } from './products.service';
import { Product } from './schemas/product.schema';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post('create')
  // TODO: createProductDto с валидацией
  createProduct(@Body() body: any): Promise<Product> {
    return this.productsService.createProduct(body);
  }
}
