import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from './schemas/product.schema';
import {
  ProductCategory,
  ProductCategorySchema,
} from './schemas/product-category.schema';
import { ProductType, ProductTypeSchema } from './schemas/product-type.schema';
import { ProductsService } from './products.service';
import { ProductCategoryService } from './product-category.service';
import { ProductTypeService } from './product-type.service';
import { ProductsController } from './products.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
    MongooseModule.forFeature([
      { name: ProductCategory.name, schema: ProductCategorySchema },
    ]),
    MongooseModule.forFeature([
      { name: ProductType.name, schema: ProductTypeSchema },
    ]),
  ],
  providers: [ProductsService, ProductCategoryService, ProductTypeService],
  controllers: [ProductsController],
})
export class ProductsModule {}
