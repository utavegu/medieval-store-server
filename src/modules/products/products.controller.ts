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
import { ProductTypeService } from './product-type.service';
import { Product } from './schemas/product.schema';
import { ProductCategory } from './schemas/product-category.schema';
import { ProductType } from './schemas/product-type.schema';
import { IdValidationPipe } from 'src/validation/id-validation.pipe';
import { ID } from 'src/typing/types/id';
import { CreateProductDto } from './typespaces/dto/create-product.dto';
import { CreateProductTypeDto } from './typespaces/dto/create-product-type.dto';

@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly productCategoryService: ProductCategoryService,
    private readonly productTypeService: ProductTypeService,
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

  @Post('types')
  addProductType(@Body() body: CreateProductTypeDto): Promise<ProductType> {
    return this.productTypeService.addProductType(body);
  }

  @Get('types')
  getAllProductTypes(): Promise<ProductType[]> {
    return this.productTypeService.getAllProductTypes();
  }

  @Delete('types/:id')
  removeProductType(@Param('id', IdValidationPipe) id: ID): Promise<void> {
    return this.productTypeService.removeProductType(id);
  }

  @Put('types/:id')
  renameProductType(
    @Param('id', IdValidationPipe) id: ID,
    @Body()
    {
      productTypeName,
    }: { productTypeName: CreateProductTypeDto['productTypeName'] },
  ): Promise<ProductType | null> {
    return this.productTypeService.renameProductType(id, productTypeName);
  }
}
