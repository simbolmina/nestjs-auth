import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { ChangeProductStatusDto } from './dto/change-product-status.dto';
import { GetFeaturedProductdDto } from './dto/get-featured-product.dto';
import { GetProductsDto } from './dto/get-product.dto';
import { Category } from 'src/categories/entities/category.entity';
import { Brand } from 'src/brands/entities/brand.entity';
import { MetaDto } from 'src/common/dto/meta.dto';
import { QueryUtils } from './utils/query.util';
import { PaginatedProductDto } from './dto/paginated-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private productRepository: Repository<Product>,
    @InjectRepository(Brand) private brandRepository: Repository<Brand>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async create(body: CreateProductDto, user: any): Promise<Product> {
    // Use the correct repositories for Brand and Category
    const brand = await this.brandRepository.findOne({
      where: { id: body.brandId },
    });

    const category = await this.categoryRepository.findOne({
      where: { id: body.categoryId },
    });

    if (!category || !brand) {
      throw new NotFoundException('Brand or Category not found');
    }
    // Create the product without brandId and categoryId from the DTO
    const product = this.productRepository.create({
      ...body,
      owner: user,
      brand: brand,
      category: category,
    });

    return await this.productRepository.save(product);
  }

  async changeStatus(id: string, body: ChangeProductStatusDto) {
    const product = await this.productRepository.findOneBy({ id });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    product.status = body.status;
    return this.productRepository.save(product);
  }

  async findAll(queryDto: GetProductsDto, user: User): Promise<any> {
    const [where, paginationOptions] = QueryUtils.buildProductQueryOptions(
      queryDto,
      user,
    );

    const [data, total] = await this.productRepository.findAndCount({
      where,
      ...paginationOptions, // Spread operator to merge paginationOptions into the main query object
    });

    const totalPages = Math.ceil(total / queryDto.limit);
    const meta: MetaDto = {
      page: queryDto.page,
      pageSize: queryDto.limit,
      totalItems: total,
      totalPages,
    };

    return { meta, data };
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.seller', 'seller')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.brand', 'brand')
      .select([
        'product',
        'category.id',
        'category.name',
        'brand.id',
        'brand.name',
        'seller.id',
        'seller.displayName',
      ])
      .where('product.id = :id', { id })
      .getOne();
    if (!product) {
      throw new NotFoundException(`Product #${id} not found`);
    }
    return product;
  }

  async findOneBySlug(slug: string): Promise<Product> {
    const product = await this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.owner', 'owner')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.brand', 'brand')
      .select(['product', 'category.name', 'brand.name'])
      .where('product.slug = :slug', { slug })
      .getOne();
    if (!product) {
      throw new NotFoundException(`Product with slug ${slug} not found`);
    }
    return product;
  }

  async update(
    id: string,
    updateProductDto: Partial<UpdateProductDto>,
    currentUser: User,
  ) {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['seller'],
    });

    if (!product) {
      throw new NotFoundException(`Product #${id} not found`);
    }
    if (product.owner.id !== currentUser.id && currentUser.role !== 'admin') {
      throw new UnauthorizedException(
        `User does not have permission to update this product`,
      );
    }
    const updatedProduct = await this.productRepository.preload({
      id: id,
      ...updateProductDto,
    });
    return this.productRepository.save(updatedProduct);
  }

  async remove(id: string, currentUser: User) {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['seller'],
    });
    if (!product) {
      throw new NotFoundException(`Product #${id} not found`);
    }
    if (product.owner.id !== currentUser.id && currentUser.role !== 'admin') {
      throw new UnauthorizedException(
        `User does not have permission to delete this product`,
      );
    }
    await this.productRepository.remove(product);
    return { message: `${product.name} removed successfully` };
  }

  createQuery(query: GetFeaturedProductdDto) {
    return this.productRepository
      .createQueryBuilder('product')
      .select()
      .where('product.status = :status', { status: query.status })
      .andWhere('product.price > :price', { price: query.price })
      .andWhere('product.isFeatured = :isFeatured', {
        isFeatured: query.isFeatured,
      })
      .orderBy('product.price', query.order)
      .limit(3)
      .getMany();
  }
}

// async update(id: string, updateProductDto: Partial<UpdateProductDto>) {
//   const product = await this.repo.preload({ id: id, ...updateProductDto });
//   if (!product) {
//     throw new NotFoundException(`Product #${id} not found`);
//   }
//   return this.repo.save(product);
// }

// createQuery(query: GetFeaturedProductdDto) {
//   let qb = this.repo.createQueryBuilder('product');

//   if (query.status) {
//     qb = qb.where('product.status = :status', { status: query.status });
//   }

//   if (query.price) {
//     qb = qb.andWhere('product.price > :price', { price: query.price });
//   }

//   if (query.isFeatured !== undefined) {
//     qb = qb.andWhere('product.isFeatured = :isFeatured', {
//       isFeatured: query.isFeatured,
//     });
//   }

//   if (query.order) {
//     qb = qb.orderBy('product.price', query.order);
//   }

//   return qb.limit(3).getMany();
// }

// async findAll() {
//   return await this.repo.find();
// }
