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
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { GetProductsDto } from './dto/get-product.dto';
import { ProductDetailsDto } from './dto/product-details.dto';
import { GetProductsResponseDto } from './dto/get-products-pagination.dto';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @ApiOperation({ summary: 'Creates a new product' })
  @ApiCreatedResponse({
    description: 'The product has been successfully created.',
    type: ProductDto,
  })
  @ApiBadRequestResponse({ description: 'Bad Request.' })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Serialize(ProductDto)
  createProduct(@Body() body: CreateProductDto, @CurrentUser() user: User) {
    return this.productsService.create(body, user);
  }

  @ApiOperation({ summary: 'Updates products status; admin only' })
  @ApiResponse({
    status: 200,
    description: 'The product status has been successfully updated.',
    type: ProductDto,
  })
  @ApiBadRequestResponse({ description: 'Bad Request.' })
  @ApiNotFoundResponse({ description: 'Product not found.' })
  @Patch(':id/status')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, new AdminGuard())
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  changeProductStatus(
    @Param('id') id: string,
    @Body() body: ChangeProductStatusDto,
  ) {
    return this.productsService.changeStatus(id, body);
  }

  @ApiOperation({ summary: 'Get featured products' })
  @ApiResponse({
    status: 200,
    description: 'Featured products have been successfully fetched.',
    type: [ProductDto],
  })
  @ApiBadRequestResponse({ description: 'Bad Request.' })
  @Get('/featured')
  getProducts(@Query() query: GetFeaturedProductdDto) {
    return this.productsService.createQuery(query);
  }

  @ApiOperation({ summary: 'Get all products with pagination option' })
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
    description: 'List of 10 of products will be fetched.',
    type: GetProductsResponseDto,
  })
  @Serialize(ProductDto)
  @ApiBadRequestResponse({ description: 'Bad Request.' })
  @Get()
  findAll(@Query() query: GetProductsDto) {
    return this.productsService.findAll(query);
  }

  @ApiOperation({ summary: 'Get product with :slug' })
  @ApiResponse({
    status: 200,
    description: 'The product has been successfully fetched.',
    type: ProductDetailsDto,
  })
  @ApiNotFoundResponse({ description: 'Product not found.' })
  @Get('/:slug')
  findOneBySlug(@Param('slug') slug: string) {
    return this.productsService.findOneBySlug(slug);
  }

  @ApiOperation({ summary: 'Get product with id/:id for admin/manager' })
  @ApiResponse({
    status: 200,
    description: 'The product has been successfully fetched.',
    type: ProductDetailsDto,
  })
  @Serialize(ProductDetailsDto)
  @ApiNotFoundResponse({ description: 'Product not found.' })
  @Get('id/:id')
  findOneById(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @ApiOperation({ summary: 'Updates product with :id' })
  @ApiResponse({
    status: 200,
    description: 'The product has been successfully updated.',
    type: ProductDto,
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiBadRequestResponse({ description: 'Bad Request.' })
  @ApiNotFoundResponse({ description: 'Product not found.' })
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

  @ApiOperation({ summary: 'Removes product with :id' })
  @ApiNoContentResponse({
    description: 'The product has been successfully removed.',
    type: Object,
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiNotFoundResponse({ description: 'Product not found.' })
  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: User) {
    return this.productsService.remove(id, user);
  }
}
