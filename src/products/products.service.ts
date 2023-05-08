import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { ChangeProductStatusDto } from './dto/change-product-status.dto';
import { GetFeaturedProductdDto } from './dto/get-product.dto';

@Injectable()
export class ProductsService {
  constructor(@InjectRepository(Product) private repo: Repository<Product>) {}
  create(productDto: CreateProductDto, user: User) {
    const product = this.repo.create(productDto);
    product.seller = user;
    return this.repo.save(product);
  }

  async changeStatus(id: string, body: ChangeProductStatusDto) {
    const product = await this.repo.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    product.status = body.status;
    return this.repo.save(product);
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

  findAll() {
    return `This action returns all products`;
  }

  findOne(id: string) {
    return `This action returns a #${id} product`;
  }

  update(id: number, productDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
