import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ApiTags } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import {
  CreateCategoryDecorator,
  DeleteCategoryByIdDecorator,
  GetAllCategoryDecorator,
  GetCategoryByIdDecorator,
  UpdateCategoryByIdDecorator,
} from './decorators';

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @CreateCategoryDecorator()
  @Post()
  create(@Body() body: CreateCategoryDto) {
    return this.categoriesService.create(body);
  }

  @GetAllCategoryDecorator()
  @Get()
  findAll(@Query('page') page: number, @Query('limit') limit: number) {
    return this.categoriesService.findAll();
  }

  @GetCategoryByIdDecorator()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(id);
  }

  @UpdateCategoryByIdDecorator()
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  @DeleteCategoryByIdDecorator()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(id);
  }

  @Post(':id/subcategories')
  createSubCategory(
    @Param('id') parentId: string,
    @Body() body: CreateCategoryDto,
  ) {
    return this.categoriesService.createSubCategory(parentId, body);
  }
}
