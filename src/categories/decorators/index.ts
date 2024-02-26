import { UseGuards, applyDecorators } from '@nestjs/common';
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
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AdminGuard } from 'src/guards/admin.guard';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { CategoryDto } from '../dto/category.dto';
import { commonErrorResponses } from 'src/common/constants';
import { UpdateCategoryDto } from '../dto/update-category.dto';

export function CreateCategoryDecorator() {
  return applyDecorators(
    ApiBearerAuth(),
    // UseGuards(JwtAuthGuard, AdminGuard),
    ApiBody({ type: CreateCategoryDto }),
    ApiOperation({ summary: 'Create a new category' }),
    ApiCreatedResponse({
      description: 'The category has been successfully created.',
      type: CategoryDto, // Assuming you have a CategoryDto
    }),
    ApiBadRequestResponse(commonErrorResponses.badRequest),
    ApiUnauthorizedResponse(commonErrorResponses.unAuthorized),
    ApiForbiddenResponse(commonErrorResponses.forbidden),
  );
}

export function GetAllCategoryDecorator() {
  return applyDecorators(
    ApiOperation({ summary: 'Retrieve all categories' }),
    ApiQuery({ name: 'page', required: false, type: Number }),
    ApiQuery({ name: 'limit', required: false, type: Number }),
    ApiOkResponse({
      description: 'The categories have been successfully retrieved.',
      type: [CategoryDto], // Assuming you have a CategoryDto
    }),
    ApiNotFoundResponse({ description: 'No categories found.' }),
    ApiBadRequestResponse(commonErrorResponses.badRequest),
    ApiUnauthorizedResponse(commonErrorResponses.unAuthorized),
    ApiForbiddenResponse(commonErrorResponses.forbidden),
  );
}

export function GetCategoryByIdDecorator() {
  return applyDecorators(
    ApiOperation({ summary: 'Retrieve a category by its ID' }),
    ApiParam({ name: 'id', description: 'ID of the category' }),
    ApiOkResponse({
      description: 'The category has been successfully retrieved.',
      type: CategoryDto, // Assuming you have a CategoryDto
    }),
    ApiNotFoundResponse({ description: 'Category not found.' }),
    ApiBadRequestResponse(commonErrorResponses.badRequest),
    ApiUnauthorizedResponse(commonErrorResponses.unAuthorized),
    ApiForbiddenResponse(commonErrorResponses.forbidden),
  );
}

export function UpdateCategoryByIdDecorator() {
  return applyDecorators(
    ApiBearerAuth(),
    // UseGuards(JwtAuthGuard, AdminGuard),
    ApiOperation({ summary: 'Update a category by its ID' }),
    ApiBody({ type: UpdateCategoryDto }),
    ApiParam({ name: 'id', description: 'ID of the category' }),
    ApiOkResponse({
      description: 'The category has been successfully updated.',
      type: CategoryDto,
    }),
    ApiNotFoundResponse({ description: 'Category not found.' }),
    ApiBadRequestResponse(commonErrorResponses.badRequest),
    ApiUnauthorizedResponse(commonErrorResponses.unAuthorized),
    ApiForbiddenResponse(commonErrorResponses.forbidden),
  );
}

export function DeleteCategoryByIdDecorator() {
  return applyDecorators(
    ApiBearerAuth(),
    // UseGuards(JwtAuthGuard, AdminGuard),
    ApiOperation({ summary: 'Delete a category by its ID' }),
    ApiParam({ name: 'id', description: 'ID of the category' }),
    ApiOkResponse({
      description: 'The category has been successfully deleted.',
    }),
    ApiNotFoundResponse({ description: 'Category not found.' }),
    ApiBadRequestResponse(commonErrorResponses.badRequest),
    ApiUnauthorizedResponse(commonErrorResponses.unAuthorized),
    ApiForbiddenResponse(commonErrorResponses.forbidden),
  );
}
