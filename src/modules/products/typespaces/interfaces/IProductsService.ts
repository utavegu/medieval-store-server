import { ID } from 'src/typing/types/id';
import { Product } from '../../schemas/product.schema';
import { CreateProductDto } from '../dto/create-product.dto';

export interface IProductsService {
  createProduct(body: CreateProductDto): Promise<Product>;
  getProductsByParams(params?: any): Promise<Product[]>; // TODO: не any, интерфейс
  getProductById(id: ID): Promise<Product>;
  removeProduct(id: ID): Promise<void>;
  editProduct(id: ID, data: Partial<Product>): Promise<Product>; // TODO: Partial<Product> -> UpdateProductDto
}
