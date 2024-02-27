import { FindManyOptions, FindOptionsWhere, In, Like } from 'typeorm';
import { Product } from '../entities/product.entity';
import { GetProductsDto } from '../dto/get-product.dto';
import { User } from 'src/users/entities/user.entity';

export class QueryUtils {
  static buildProductQueryOptions(
    queryDto: GetProductsDto,
    user: User,
  ): [FindOptionsWhere<Product>, FindManyOptions<Product>] {
    const {
      page = 1,
      limit = 10,
      sortBy,
      sortOrder,
      category,
      brand,
      tags,
      query,
    } = queryDto;

    let where: FindOptionsWhere<Product> = {};

    // If filtering by categories, assume we need a JOIN and filter on that relation
    if (category && category.length) {
      where.category = { name: In(category) };
    }

    // If filtering by brands, similar approach as category
    if (brand && brand.length) {
      where.brand = { name: In(brand) };
    }

    // Handling tags if they are part of the product directly and are an array of strings
    // Note: Adjust this based on your actual entity structure
    //   if (tags && tags.length) {
    //     where.tags = { name: In(tags) }; // This line assumes tags is directly a field of Product
    //   }

    // Add logic for query (search) if needed
    if (query) {
      // This approach is simplified and not equivalent to $or, but it's compatible with FindOptionsWhere
      where.name = Like(`%${query}%`);
      // You might need a separate mechanism for handling multiple fields if not using QueryBuilder
    }

    let order: FindManyOptions<Product>['order'] = {};
    if (sortBy) {
      order[sortBy] = sortOrder || 'ASC';
    }

    // Here we are only returning pagination and sorting options without 'where'
    const paginationOptions: FindManyOptions<Product> = {
      order,
      skip: (page - 1) * limit,
      take: limit,
      relations: ['category', 'brand'],
    };

    return [where, paginationOptions];
  }
}
