import { Body, Controller, Post } from '@nestjs/common';
import { ProductsService } from './products.service';
import { Product } from './schemas/product.schema';
import { CreateProductDto } from './typespaces/dto/create-product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post('create')
  createProduct(@Body() body: CreateProductDto): Promise<Product> {
    return this.productsService.createProduct(body);
  }
}
