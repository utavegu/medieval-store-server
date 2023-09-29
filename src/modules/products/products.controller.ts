import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ProductsService } from './products.service';
import { ProductCategoryService } from './product-category.service';
import { ProductTypeService } from './product-type.service';
import { ProductSubtypeService } from './product-subtype.service';
import { IdValidationPipe } from 'src/validation/id-validation.pipe';
import {
  MAX_IMAGES_COUNT,
  filesInterceptorSetup,
  imageParseFilePipeInstance,
} from 'src/modules/files/multer.setup';
import { Product } from './schemas/product.schema';
import { ProductCategory } from './schemas/product-category.schema';
import { ProductType } from './schemas/product-type.schema';
import { ProductSubtype } from './schemas/product-subtype.schema';
import { ID } from 'src/typing/types/id';
import { CreateProductDto } from './typespaces/dto/create-product.dto';
import { CreateProductTypeDto } from './typespaces/dto/create-product-type.dto';
import { CreateProductSubtypeDto } from './typespaces/dto/create-product-subtype.dto';
import { IProductsQueryParams } from './typespaces/interfaces/IProductsQueryParams';
import { removePhotoDto } from './typespaces/dto/remove-photo.dto';

// TODO: возможность удалять фото. А для редактирования загружается весь массив с превьюшками.

@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly productCategoryService: ProductCategoryService,
    private readonly productTypeService: ProductTypeService,
    private readonly productSubtypeService: ProductSubtypeService,
  ) {}

  @Post()
  @UseInterceptors(
    FilesInterceptor('photos', MAX_IMAGES_COUNT, filesInterceptorSetup),
  )
  createProduct(
    @UploadedFiles(imageParseFilePipeInstance) files: Express.Multer.File[],
    @Body() body: CreateProductDto,
  ): Promise<Product> {
    return this.productsService.createProduct(body, files);
  }

  @Get()
  getProductsByParams(
    @Query() queryParams: IProductsQueryParams,
  ): Promise<Product[]> {
    return this.productsService.getProductsByParams(queryParams);
  }

  @Get(':id')
  getProductById(@Param('id', IdValidationPipe) id: ID): Promise<Product> {
    return this.productsService.getProductById(id);
  }

  @Delete(':id')
  removeProduct(@Param('id', IdValidationPipe) id: ID): Promise<void> {
    return this.productsService.removeProduct(id);
  }

  @Put(':id')
  @UseInterceptors(
    FilesInterceptor('photos', MAX_IMAGES_COUNT, filesInterceptorSetup),
  )
  editProduct(
    @Param('id', IdValidationPipe) id: ID,
    @UploadedFiles(imageParseFilePipeInstance) files: Express.Multer.File[],
    @Body() body: CreateProductDto,
  ): Promise<Product | null> {
    return this.productsService.editProduct(id, body, files);
  }

  @Delete(':id/photo')
  removePhoto(
    @Param('id', IdValidationPipe) id: ID,
    @Body() body: removePhotoDto,
  ): Promise<void> {
    return this.productsService.removePhoto({ ...body, unitId: id });
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

  @Get('types/:id')
  getAllProductTypesInCategory(
    @Param('id', IdValidationPipe)
    parentCategoryId: ProductType['parentCategory'],
  ): Promise<ProductType[]> {
    return this.productTypeService.getAllProductTypesInCategory(
      parentCategoryId,
    );
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

  @Post('subtypes')
  addProductSubtype(
    @Body() body: CreateProductSubtypeDto,
  ): Promise<ProductSubtype> {
    return this.productSubtypeService.addProductSubtype(body);
  }

  @Get('subtypes/:id')
  getAllProductSubtypesInType(
    @Param('id', IdValidationPipe) parentTypeId: ProductSubtype['parentType'],
  ): Promise<ProductSubtype[]> {
    return this.productSubtypeService.getAllProductSubtypesInType(parentTypeId);
  }

  @Delete('subtypes/:id')
  removeProductSubtype(@Param('id', IdValidationPipe) id: ID): Promise<void> {
    return this.productSubtypeService.removeProductSubtype(id);
  }

  @Put('subtypes/:id')
  renameProductSubtype(
    @Param('id', IdValidationPipe) id: ID,
    @Body()
    {
      productSubtypeName,
    }: { productSubtypeName: CreateProductSubtypeDto['productSubtypeName'] },
  ): Promise<ProductSubtype | null> {
    return this.productSubtypeService.renameProductSubtype(
      id,
      productSubtypeName,
    );
  }
}
