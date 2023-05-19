import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { Serialize } from '../interceptors/serialize.interceptor';
import { ProductDto } from './dto/product.dto';
import { ChangeProductStatusDto } from './dto/change-product-status.dto';
import { AuthGuard } from '@nestjs/passport';
import { AdminGuard } from '../guards/admin.guard';
import { GetFeaturedProductdDto } from './dto/get-featured-product.dto';
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
  ApiTags,
} from '@nestjs/swagger';
import { GetProductsDto } from './dto/get-product.dto';
import { ProductDetailsDto } from './dto/product-details.dto';
import { GetProductsResponseDto } from './dto/get-products-pagination.dto';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @ApiOperation({
    summary: 'Create a new product.',
    description:
      'This operation allows authenticated users to create a new product.',
  })
  @ApiCreatedResponse({
    description: 'The product has been successfully created.',
    type: ProductDto,
  })
  @ApiBadRequestResponse({
    description: 'The request payload is invalid. Please verify your input.',
  })
  @ApiForbiddenResponse({
    description: 'Authenticated but not authorized to perform this operation.',
  })
  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Serialize(ProductDto)
  createProduct(@Body() body: CreateProductDto, @CurrentUser() user: User) {
    return this.productsService.create(body, user);
  }

  @ApiOperation({
    summary: 'Update product status.',
    description:
      'This operation allows admins to update the status of a product.',
  })
  @ApiOkResponse({
    description:
      'The product status has been successfully updated and the updated product details are returned.',
    type: ProductDto,
  })
  @ApiBadRequestResponse({
    description: 'The request payload is invalid. Please verify your input.',
  })
  @ApiNotFoundResponse({
    description: 'The product with the provided id could not be found.',
  })
  @Patch(':id/status')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  changeProductStatus(
    @Param('id') id: string,
    @Body() body: ChangeProductStatusDto,
  ) {
    return this.productsService.changeStatus(id, body);
  }

  @ApiOperation({
    summary: 'Get featured products.',
    description: 'This operation fetches a list of featured products.',
  })
  @ApiOkResponse({
    description: 'The list of featured products has been successfully fetched.',
    type: [ProductDto],
  })
  @ApiBadRequestResponse({
    description:
      'The request query parameters are invalid. Please verify your input.',
  })
  @Get('/featured')
  getProducts(@Query() query: GetFeaturedProductdDto) {
    return this.productsService.createQuery(query);
  }

  @ApiOperation({
    summary: 'Get all products with pagination option.',
    description: 'This operation fetches a paginated list of all products.',
  })
  @ApiQuery({
    name: 'page',
    description: 'Page number',
    example: 1,
    required: false,
  })
  @ApiQuery({
    name: 'limit',
    description: 'Number of items per page',
    example: 10,
    required: false,
  })
  @ApiOkResponse({
    description:
      'The paginated list of products has been successfully fetched.',
    type: GetProductsResponseDto,
  })
  @ApiBadRequestResponse({
    description:
      'The request query parameters are invalid. Please verify your input.',
  })
  @Serialize(ProductDto)
  @Get()
  findAll(@Query() query: GetProductsDto) {
    return this.productsService.findAll(query);
  }

  @ApiOperation({
    summary: 'Get a product by its slug.',
    description: 'This operation fetches a specific product using its slug.',
  })
  @ApiOkResponse({
    description: 'The product has been successfully fetched.',
    type: ProductDetailsDto,
  })
  @ApiNotFoundResponse({
    description: 'A product with the provided slug could not be found.',
  })
  @Get('/:slug')
  findOneBySlug(@Param('slug') slug: string) {
    return this.productsService.findOneBySlug(slug);
  }

  @ApiOperation({
    summary: 'Get a product by its ID.',
    description:
      'This operation fetches a specific product using its ID. This operation is restricted to admins and managers.',
  })
  @ApiOkResponse({
    description: 'The product has been successfully fetched.',
    type: ProductDetailsDto,
  })
  @Serialize(ProductDetailsDto)
  @ApiNotFoundResponse({ description: 'Product not found.' })
  @ApiNotFoundResponse({
    description: 'A product with the provided ID could not be found.',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get('id/:id')
  findOneById(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @ApiOperation({
    summary: 'Update a product.',
    description:
      'This operation allows authenticated users to update a specific product.',
  })
  @ApiOkResponse({
    description:
      'The product has been successfully updated and the updated product details are returned.',
    type: ProductDto,
  })
  @ApiBadRequestResponse({
    description:
      'The request payload or path parameter is invalid. Please verify your input.',
  })
  @ApiNotFoundResponse({
    description: 'A product with the provided ID could not be found.',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiBody({ type: UpdateProductDto })
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string,
    @Body() body: Partial<UpdateProductDto>,
    @CurrentUser() currentUser: User,
  ) {
    return this.productsService.update(id, body, currentUser);
  }

  @ApiOperation({
    summary: 'Delete a product.',
    description:
      'This operation allows authenticated ownder of the product or admin to delete a specific product.',
  })
  @ApiNoContentResponse({
    description: 'The product has been successfully deleted.',
  })
  @ApiNotFoundResponse({
    description: 'A product with the provided ID could not be found.',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: User) {
    return this.productsService.remove(id, user);
  }
}
