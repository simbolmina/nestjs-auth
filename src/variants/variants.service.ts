import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateVariantDto } from './dto/create-variant.dto';
import { UpdateVariantDto } from './dto/update-variant.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Variant } from './entities/variant.entity';
import { Repository } from 'typeorm';
import { VariantValue } from './entities/variant-values.entity';
import { Category } from 'src/categories/entities/category.entity';

@Injectable()
export class VariantsService {
  constructor(
    @InjectRepository(Variant) private variantRepository: Repository<Variant>,
    @InjectRepository(VariantValue)
    private variantValueRepository: Repository<VariantValue>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(createVariantDto: CreateVariantDto) {
    const variant = this.variantRepository.create({
      name: createVariantDto.name,
    });

    // Handle category associations if categoryIds are provided
    if (
      createVariantDto.categoryIds &&
      createVariantDto.categoryIds.length > 0
    ) {
      // Fetch category entities based on provided IDs
      const categories = await this.categoryRepository.findByIds(
        createVariantDto.categoryIds,
      );
      // Associate categories with the variant
      variant.categories = categories; // Assuming your Variant entity has a 'categories' relation field
    }

    // Save the variant to get its generated ID if needed, including category associations
    const savedVariant = await this.variantRepository.save(variant);

    if (createVariantDto.values && createVariantDto.values.length > 0) {
      const variantValues = createVariantDto.values.map((valueDto) => {
        return this.variantValueRepository.create({
          value: valueDto.value,
          variant: savedVariant, // Associate each value with the saved variant
        });
      });

      // Save the variant values
      await this.variantValueRepository.save(variantValues);
    }

    return savedVariant;
  }

  async findAll() {
    return await this.variantRepository.find({
      relations: ['values', 'categories'],
    });
  }

  async findOne(id: string) {
    return await this.variantRepository.findOneOrFail({
      where: { id },
      relations: ['values'],
    });
  }

  async update(id: string, updateVariantDto: UpdateVariantDto) {
    const variant = await this.variantRepository.findOne({
      where: { id },
      relations: ['values'],
    });
    if (!variant) {
      throw new NotFoundException(`Variant #${id} not found`);
    }

    const updatedVariant = await this.variantRepository.preload({
      id: id,
      ...updateVariantDto,
    });

    return this.variantRepository.save(updatedVariant);
  }

  async remove(variantId: string) {
    // First, find and remove all VariantValue entities related to the Variant
    const variantValues = await this.variantValueRepository.find({
      where: { variant: { id: variantId } },
    });
    await this.variantValueRepository.remove(variantValues);

    // Then, remove the Variant itself
    const variant = await this.variantRepository.findOne({
      where: { id: variantId },
    });
    if (variant) {
      await this.variantRepository.remove(variant);
    }
  }
}
