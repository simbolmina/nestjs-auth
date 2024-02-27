import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateVariantDto } from './dto/create-variant.dto';
import { UpdateVariantDto } from './dto/update-variant.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Variant } from './entities/variant.entity';
import { In, Repository } from 'typeorm';
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
    const variant = await this.variantRepository.findOne({
      where: { id },
      relations: ['values', 'categories'],
    });

    if (!variant) {
      throw new NotFoundException(`Variant #${id} not found`);
    }
    return variant;
  }

  async update(id: string, updateVariantDto: UpdateVariantDto) {
    const variant = await this.variantRepository.findOne({
      where: { id },
      relations: ['categories', 'values'], // Ensure 'categories' is included in relations
    });

    if (!variant) {
      throw new NotFoundException(`Variant #${id} not found`);
    }

    // Update variant properties based on updateVariantDto
    this.variantRepository.merge(variant, updateVariantDto);

    // Handle category associations if categoryIds are provided in the DTO
    // Handle category associations if categoryIds are provided in the DTO
    if (
      updateVariantDto.categoryIds &&
      updateVariantDto.categoryIds.length > 0
    ) {
      // Replace findByIds with findBy using the In operator
      const categories = await this.categoryRepository.findBy({
        id: In(updateVariantDto.categoryIds),
      });
      variant.categories = categories; // Update the categories associated with the variant
    }

    // If there are updated values, manage them here
    // (You can add similar logic as in your create method, if needed, to handle variant values updates)

    return this.variantRepository.save(variant); // Save the updated variant with new category associations
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
