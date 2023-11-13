import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from './schemas/product.schema';
import { getImagesPaths } from 'src/helpers/getImagesPaths';
import { getProductsSortingConditions } from 'src/helpers/getProductsSortingConditions';
import { DEFAULT_LIMIT, DEFAULT_OFFSET } from 'src/constants';
import { FilesService } from '../files/files.service';
import { ID } from 'src/typing/types/id';
import { CreateProductDto } from './typespaces/dto/create-product.dto';
import { removePhotoDto } from './typespaces/dto/remove-photo.dto';
import { IProductsService } from './typespaces/interfaces/IProductsService';
import { IProductsQueryParams } from './typespaces/interfaces/IProductsQueryParams';
import { IPriceRange } from './typespaces/interfaces/IPriceRange';
import { IProductsFilterParams } from './typespaces/interfaces/IProductsFilterParams';
import { FileType } from '../files/typespaces/enums/file-type.enum';

@Injectable()
export class ProductsService implements IProductsService {
  constructor(
    @InjectModel(Product.name) private ProductModel: Model<ProductDocument>,
    private readonly filesService: FilesService,
  ) {}

  async createProduct(
    body: CreateProductDto,
    files: Express.Multer.File[],
  ): Promise<Product> {
    try {
      const product = await (
        await (
          await (
            await this.ProductModel.create({
              ...body,
              price: Math.abs(Number(body.price)).toFixed(2),
              photos: getImagesPaths(files),
            })
          ).populate({
            path: 'category',
            select: 'productCategoryName',
          })
        ).populate({
          path: 'type',
          select: 'productTypeName',
        })
      ).populate({
        path: 'subtype',
        select: 'productSubtypeName',
      });
      await this.filesService.uploadFiles(FileType.IMAGE, product.id, files);
      return product;
    } catch (err) {
      throw new HttpException(err.message, err.status || 500);
    }
  }

  async removePhoto({
    fileType,
    unitId,
    fileName,
  }: removePhotoDto & { unitId: ID }): Promise<void> {
    try {
      await this.ProductModel.updateOne(
        { _id: unitId },
        { $pull: { photos: fileName } },
      );
      await this.filesService.deleteFile(fileType, unitId, fileName);
      return;
    } catch (err) {
      throw new HttpException(err.message, err.status || 500);
    }
  }

  async getProductsByParams({
    productName,
    minPrice,
    maxPrice,
    category,
    type,
    subtype,
    sort,
    materials,
    page = 1,
  }: IProductsQueryParams): Promise<{ products: Product[]; pages: number }> {
    try {
      const priceRange: IPriceRange = {};

      if (minPrice) priceRange['$gte'] = Number(minPrice);
      if (maxPrice) priceRange['$lte'] = Number(maxPrice);

      const productsFilterParams = {
        productName: productName && {
          $regex: productName.trim(),
          $options: 'i',
        },
        price: !!Object.keys(priceRange).length ? priceRange : undefined, // TODO: на фронтенде это двурычажковый рэндж
        category, // TODO: массив (но на фронте фильтр подкатегорий разворачивается в зависимости от чекбоксов выбранного типа - если категория выбрана только одна, откроются только её типы и так далее)
        type, // TODO: массив (определить в каком виде будет прилетать формдата с чекбоксов)
        subtype, // TODO: массив
        materials: !!materials && { $all: materials.split(',') },
      };

      for (const param in productsFilterParams) {
        const key = param as keyof IProductsFilterParams;
        if (!productsFilterParams[key]) {
          delete productsFilterParams[key];
        }
      }

      const productsPerPage = 3; // Такое себе хардкодить это, но пока оставлю.
      const offset = (Number(page) - 1) * productsPerPage;
      const total = await this.ProductModel.find(productsFilterParams).count();
      const pages = Math.ceil(total / productsPerPage);

      const products = await this.ProductModel.find(productsFilterParams)
        .limit(productsPerPage)
        .skip(offset)
        // TODO
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        .sort(getProductsSortingConditions(sort))
        .select('-__v')
        .populate({
          path: 'category',
          select: 'productCategoryName',
        })
        .populate({
          path: 'type',
          select: 'productTypeName',
        })
        .populate({
          path: 'subtype',
          select: 'productSubtypeName',
        });
      return { products, pages };
    } catch (err) {
      throw new HttpException(err.message, err.status || 500);
    }
  }

  async getProductById(id: ID): Promise<Product> {
    try {
      const targetProduct = await this.ProductModel.findById(id)
        .select('-__v -createdAt -updatedAt')
        .populate({
          path: 'category',
          select: 'productCategoryName',
        })
        .populate({
          path: 'type',
          select: 'productTypeName',
        })
        .populate({
          path: 'subtype',
          select: 'productSubtypeName',
        });
      if (!targetProduct) {
        throw new NotFoundException('Данный товар не найден!'); // TODO: Константа
      }
      return targetProduct;
    } catch (err) {
      throw new HttpException(err.message, err.status || 500);
    }
  }

  async removeProduct(id: ID): Promise<void> {
    try {
      await this.ProductModel.findByIdAndDelete(id);
      await this.filesService.removeDirectory(FileType.IMAGE, id);
    } catch (err) {
      throw new HttpException(err.message, err.status || 500);
    }
  }

  async editProduct(
    id: ID,
    data: CreateProductDto,
    files: Express.Multer.File[],
  ): Promise<Product> {
    try {
      const product = await this.ProductModel.findByIdAndUpdate(
        id,
        {
          ...data,
          updatedAt: new Date().toISOString(),
          price: Math.abs(Number(data.price)).toFixed(2),
          photos: getImagesPaths(files),
        },
        { new: true },
      )
        .select('-__v -createdAt -updatedAt')
        .populate({
          path: 'category',
          select: 'productCategoryName',
        })
        .populate({
          path: 'type',
          select: 'productTypeName',
        })
        .populate({
          path: 'subtype',
          select: 'productSubtypeName',
        });
      if (product) {
        await this.filesService.uploadFiles(FileType.IMAGE, product.id, files);
      } else {
        throw new NotFoundException('Данный товар не найден!'); // TODO: Константа
      }
      return product;
    } catch (err) {
      throw new HttpException(err.message, err.status || 500);
    }
  }
}
