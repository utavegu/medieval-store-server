import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductCategoryService } from './product-category.service';
import { Product } from './schemas/product.schema';
import { ProductCategory } from './schemas/product-category.schema';
import { IdValidationPipe } from 'src/validation/id-validation.pipe';
import { ID } from 'src/typing/types/id';
import { CreateProductDto } from './typespaces/dto/create-product.dto';

@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly productCategoryService: ProductCategoryService,
  ) {}

  @Post('create')
  createProduct(@Body() body: CreateProductDto): Promise<Product> {
    return this.productsService.createProduct(body);
  }

  @Post('categories')
  addCategory(
    @Body() { productCategoryName }: { productCategoryName: string },
  ): Promise<ProductCategory> {
    return this.productCategoryService.addCategory(productCategoryName);
  }

  @Get('categories')
  getAllCategories(): Promise<ProductCategory[]> {
    return this.productCategoryService.getAllCategories();
  }

  @Delete('categories/:id')
  removeCategory(@Param('id', IdValidationPipe) id: ID): Promise<void> {
    return this.productCategoryService.removeCategory(id);
  }

  @Put('categories/:id')
  renameCategory(
    @Param('id', IdValidationPipe) id: ID,
    @Body() { productCategoryName }: { productCategoryName: string },
  ): Promise<ProductCategory | null> {
    return this.productCategoryService.renameCategory(id, productCategoryName);
  }
}
