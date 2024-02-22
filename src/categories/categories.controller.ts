import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { CategoryDto } from './dto/category.dto';
import { AdminGuard } from 'src/guards/admin.guard';

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBody({ type: CreateCategoryDto })
  @ApiOperation({ summary: 'Create a new category' })
  @ApiCreatedResponse({
    description: 'The category has been successfully created.',
    type: CategoryDto, // Assuming you have a CategoryDto
  })
  @ApiBadRequestResponse({ description: 'Invalid data input.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  create(@Body() body: CreateCategoryDto) {
    return this.categoriesService.create(body);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all categories' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiOkResponse({
    description: 'The categories have been successfully retrieved.',
    type: [CategoryDto], // Assuming you have a CategoryDto
  })
  @ApiNotFoundResponse({ description: 'No categories found.' })
  findAll(@Query('page') page: number, @Query('limit') limit: number) {
    return this.categoriesService.findAll(page, limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a category by its ID' })
  @ApiParam({ name: 'id', description: 'ID of the category' })
  @ApiOkResponse({
    description: 'The category has been successfully retrieved.',
    type: CategoryDto, // Assuming you have a CategoryDto
  })
  @ApiNotFoundResponse({ description: 'Category not found.' })
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiOperation({ summary: 'Update a category by its ID' })
  @ApiBody({ type: UpdateCategoryDto })
  @ApiParam({ name: 'id', description: 'ID of the category' })
  @ApiOkResponse({
    description: 'The category has been successfully updated.',
    type: CategoryDto,
  })
  @ApiBadRequestResponse({ description: 'Invalid data input.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  @ApiNotFoundResponse({ description: 'Category not found.' })
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiOperation({ summary: 'Delete a category by its ID' })
  @ApiParam({ name: 'id', description: 'ID of the category' })
  @ApiOkResponse({
    description: 'The category has been successfully deleted.',
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  @ApiNotFoundResponse({ description: 'Category not found.' })
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(id);
  }
}
