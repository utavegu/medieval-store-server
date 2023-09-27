import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from './schemas/product.schema';
import {
  ProductCategory,
  ProductCategorySchema,
} from './schemas/product-category.schema';
import { ProductType, ProductTypeSchema } from './schemas/product-type.schema';
import {
  ProductSubtype,
  ProductSubtypeSchema,
} from './schemas/product-subtype.schema';
import { ProductsService } from './products.service';
import { ProductCategoryService } from './product-category.service';
import { ProductTypeService } from './product-type.service';
import { ProductSubtypeService } from './product-subtype.service';
import { ProductsController } from './products.controller';
import { FilesService } from '../files/files.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
    MongooseModule.forFeature([
      { name: ProductCategory.name, schema: ProductCategorySchema },
    ]),
    MongooseModule.forFeature([
      { name: ProductType.name, schema: ProductTypeSchema },
    ]),
    MongooseModule.forFeature([
      { name: ProductSubtype.name, schema: ProductSubtypeSchema },
    ]),
  ],
  providers: [
    ProductsService,
    ProductCategoryService,
    ProductTypeService,
    ProductSubtypeService,
    FilesService,
  ],
  controllers: [ProductsController],
})
export class ProductsModule {}
