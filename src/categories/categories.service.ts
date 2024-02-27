import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private repo: Repository<Category>,
  ) {}

  async create(body: CreateCategoryDto) {
    const category = this.repo.create(body);
    return await this.repo.save(category);
  }

  async findAll(page: number = 1, limit: number = 10) {
    const [data, total] = await this.repo.findAndCount({
      skip: (page - 1) * limit,
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

  async findOne(id: string): Promise<Category> {
    const category = await this.repo.findOne({
      where: { id },
      relations: ['variants'],
    });
    if (!category) {
      throw new NotFoundException(`Category #${id} not found`);
    }
    return category;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.repo.preload({
      id: id,
      ...updateCategoryDto,
    });

    if (!category) {
      throw new NotFoundException(`Category #${id} not found`);
    }
    return this.repo.save(category);
  }

  async remove(id: string) {
    const category = await this.repo.findOneBy({ id });
    if (!category) {
      throw new NotFoundException(`Category #${id} not found`);
    }
    await this.repo.remove(category);
    return { message: `${category.name} removed successfully` };
  }

  async createSubCategory(
    parentId: string,
    body: CreateCategoryDto,
  ): Promise<Category> {
    const parentCategory = await this.repo.findOneBy({ id: parentId });
    if (!parentCategory) {
      throw new NotFoundException(`Parent category #${parentId} not found`);
    }
    const subCategory = this.repo.create(body);
    subCategory.parent = parentCategory; // Set the parent of the subcategory
    return await this.repo.save(subCategory);
  }
}
