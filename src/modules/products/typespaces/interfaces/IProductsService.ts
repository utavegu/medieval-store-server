import { ID } from 'src/typing/types/id';
import { Product } from '../../schemas/product.schema';
import { CreateProductDto } from '../dto/create-product.dto';
import { removePhotoDto } from '../dto/remove-photo.dto';
import { IProductsQueryParams } from './IProductsQueryParams';

export interface IProductsService {
  createProduct(
    body: CreateProductDto,
    files: Express.Multer.File[],
  ): Promise<Product>;
  removePhoto(body: removePhotoDto & { unitId: ID }): Promise<void>;
  getProductsByParams(params?: IProductsQueryParams): Promise<Product[]>;
  getProductById(id: ID): Promise<Product>;
  removeProduct(id: ID): Promise<void>;
  editProduct(
    id: ID,
    data: CreateProductDto,
    files: Express.Multer.File[],
  ): Promise<Product>;
}
