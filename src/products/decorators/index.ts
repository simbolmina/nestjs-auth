import { UseGuards, applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ProductDto } from '../dto/product.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { AdminGuard } from 'src/guards/admin.guard';
import { AuthGuard } from '@nestjs/passport';
import { GetProductsResponseDto } from '../dto/get-products-pagination.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { ProductDetailsDto } from '../dto/product-details.dto';
import { UpdateProductDto } from '../dto/update-product.dto';

export function CreateProductDecorator() {
  return applyDecorators(
    ApiOperation({
      summary: 'Create a new product.',
      description:
        'This operation allows authenticated users to create a new product.',
    }),
    ApiCreatedResponse({
      description: 'The product has been successfully created.',
      type: ProductDto,
    }),
    ApiBadRequestResponse({
      description: 'The request payload is invalid. Please verify your input.',
    }),
    ApiForbiddenResponse({
      description:
        'Authenticated but not authorized to perform this operation.',
    }),
    ApiBearerAuth(),
    UseGuards(JwtAuthGuard),
  );
}

export function ChangeProductStatusDecorator() {
  return applyDecorators(
    ApiOperation({
      summary: 'Update product status.',
      description:
        'This operation allows admins to update the status of a product.',
    }),
    ApiOkResponse({
      description:
        'The product status has been successfully updated and the updated product details are returned.',
      type: ProductDto,
    }),
    ApiBadRequestResponse({
      description: 'The request payload is invalid. Please verify your input.',
    }),
    ApiNotFoundResponse({
      description: 'The product with the provided id could not be found.',
    }),
    ApiUnauthorizedResponse({ description: 'Unauthorized.' }),
    ApiBearerAuth(),
    UseGuards(JwtAuthGuard, AdminGuard),
  );
}

export function GetFeaturedProductsDecorator() {
  return applyDecorators(
    ApiOperation({
      summary: 'Get featured products.',
      description: 'This operation fetches a list of featured products.',
    }),
    ApiOkResponse({
      description:
        'The list of featured products has been successfully fetched.',
      type: [ProductDto],
    }),
    ApiBadRequestResponse({
      description:
        'The request query parameters are invalid. Please verify your input.',
    }),
  );
}

export function GetAllProductsDecorator() {
  return applyDecorators(
    ApiOperation({
      summary: 'Get all products with pagination option.',
      description: 'This operation fetches a paginated list of all products.',
    }),
    ApiQuery({
      name: 'page',
      description: 'Page number',
      example: 1,
      required: false,
    }),
    ApiQuery({
      name: 'limit',
      description: 'Number of items per page',
      example: 10,
      required: false,
    }),
    ApiOkResponse({
      description:
        'The paginated list of products has been successfully fetched.',
      type: GetProductsResponseDto,
    }),
    ApiBadRequestResponse({
      description:
        'The request query parameters are invalid. Please verify your input.',
    }),
    Serialize(ProductDto),
  );
}

export function GetProductBySlugDecorator() {
  return applyDecorators(
    ApiOperation({
      summary: 'Get a product by its slug.',
      description: 'This operation fetches a specific product using its slug.',
    }),
    ApiOkResponse({
      description: 'The product has been successfully fetched.',
      type: ProductDetailsDto,
    }),
    ApiNotFoundResponse({
      description: 'A product with the provided slug could not be found.',
    }),
  );
}

export function GetProductByIdDecorator() {
  return applyDecorators(
    ApiOperation({
      summary: 'Get a product by its ID.',
      description:
        'This operation fetches a specific product using its ID. This operation is restricted to admins and managers.',
    }),
    ApiOkResponse({
      description: 'The product has been successfully fetched.',
      type: ProductDetailsDto,
    }),
    Serialize(ProductDetailsDto),
    ApiNotFoundResponse({
      description: 'A product with the provided ID could not be found.',
    }),
    ApiUnauthorizedResponse({ description: 'Unauthorized.' }),
    ApiForbiddenResponse({ description: 'Forbidden.' }),
    ApiBearerAuth(),
    UseGuards(JwtAuthGuard, AdminGuard),
  );
}

export function UpdateProductByIdDecorator() {
  return applyDecorators(
    ApiOperation({
      summary: 'Update a product.',
      description:
        'This operation allows authenticated users to update a specific product.',
    }),
    ApiOkResponse({
      description:
        'The product has been successfully updated and the updated product details are returned.',
      type: ProductDto,
    }),
    ApiBadRequestResponse({
      description:
        'The request payload or path parameter is invalid. Please verify your input.',
    }),
    ApiNotFoundResponse({
      description: 'A product with the provided ID could not be found.',
    }),
    ApiBearerAuth(),
    UseGuards(JwtAuthGuard),
    ApiBody({ type: UpdateProductDto }),
  );
}

export function DeleteProductByIdDecorator() {
  return applyDecorators(
    ApiOperation({
      summary: 'Delete a product.',
      description:
        'This operation allows authenticated ownder of the product or admin to delete a specific product.',
    }),
    ApiNoContentResponse({
      description: 'The product has been successfully deleted.',
    }),
    ApiNotFoundResponse({
      description: 'A product with the provided ID could not be found.',
    }),
    ApiBearerAuth(),
    UseGuards(JwtAuthGuard),
  );
}
