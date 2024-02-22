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

@Injectable()
export class ProductsService {
  constructor(@InjectRepository(Product) private repo: Repository<Product>) {}
  async create(body: CreateProductDto, user: User) {
    const product = this.repo.create(body);
    product.seller = user;
    product.category = body.categoryId;
    product.brand = body.brandId;
    return await this.repo.save(product);
  }

  async changeStatus(id: string, body: ChangeProductStatusDto) {
    const product = await this.repo.findOneBy({ id });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    product.status = body.status;
    return this.repo.save(product);
  }

  async findAll(query: GetProductsDto) {
    const { page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const [data, total] = await this.repo.findAndCount({
      skip: skip,
      take: limit,
    });

    return {
      data,
      total,
      page,
      limit,
      pageCount: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.repo
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
    const product = await this.repo
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.seller', 'seller')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.brand', 'brand')
      .select(['product', 'category.name', 'brand.name', 'seller.displayName'])
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
    const product = await this.repo.findOne({
      where: { id },
      relations: ['seller'],
    });

    if (!product) {
      throw new NotFoundException(`Product #${id} not found`);
    }
    if (product.seller.id !== currentUser.id && currentUser.role !== 'admin') {
      throw new UnauthorizedException(
        `User does not have permission to update this product`,
      );
    }
    const updatedProduct = await this.repo.preload({
      id: id,
      ...updateProductDto,
    });
    return this.repo.save(updatedProduct);
  }

  async remove(id: string, currentUser: User) {
    const product = await this.repo.findOne({
      where: { id },
      relations: ['seller'],
    });
    if (!product) {
      throw new NotFoundException(`Product #${id} not found`);
    }
    if (product.seller.id !== currentUser.id && currentUser.role !== 'admin') {
      throw new UnauthorizedException(
        `User does not have permission to delete this product`,
      );
    }
    await this.repo.remove(product);
    return { message: `${product.name} removed successfully` };
  }

  createQuery(query: GetFeaturedProductdDto) {
    return this.repo
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
