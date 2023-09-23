import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from './schemas/product.schema';
import {
  ProductCategory,
  ProductCategorySchema,
} from './schemas/product-category.schema';
import { ProductsService } from './products.service';
import { ProductCategoryService } from './product-category.service';
import { ProductsController } from './products.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
    MongooseModule.forFeature([
      { name: ProductCategory.name, schema: ProductCategorySchema },
    ]),
  ],
  providers: [ProductsService, ProductCategoryService],
  controllers: [ProductsController],
})
export class ProductsModule {}
