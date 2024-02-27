import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { Serialize } from '../interceptors/serialize.interceptor';
import { ProductDto } from './dto/product.dto';
import { ChangeProductStatusDto } from './dto/change-product-status.dto';
import { GetFeaturedProductdDto } from './dto/get-featured-product.dto';
import { ApiTags } from '@nestjs/swagger';
import { GetProductsDto } from './dto/get-product.dto';
import {
  ChangeProductStatusDecorator,
  CreateProductDecorator,
  DeleteProductByIdDecorator,
  GetAllProductsDecorator,
  GetFeaturedProductsDecorator,
  GetProductByIdDecorator,
  GetProductBySlugDecorator,
  UpdateProductByIdDecorator,
} from './decorators';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Serialize(ProductDto)
  @CreateProductDecorator()
  @UseGuards(JwtAuthGuard)
  @Post()
  createProduct(
    @Body() body: CreateProductDto,
    @CurrentUser() user: Partial<User>,
  ) {
    return this.productsService.create(body, user);
  }

  @GetAllProductsDecorator()
  @Get()
  findAll(@Query() query: GetProductsDto, @CurrentUser() user: any) {
    console.log('query', query);
    return this.productsService.findAll(query, user);
  }

  @ChangeProductStatusDecorator()
  @Patch(':id/status')
  changeProductStatus(
    @Param('id') id: string,
    @Body() body: ChangeProductStatusDto,
  ) {
    return this.productsService.changeStatus(id, body);
  }

  @GetFeaturedProductsDecorator()
  @Get('/featured')
  getProducts(@Query() query: GetFeaturedProductdDto) {
    return this.productsService.createQuery(query);
  }

  @GetProductBySlugDecorator()
  @Get('/:slug')
  findOneBySlug(@Param('slug') slug: string) {
    return this.productsService.findOneBySlug(slug);
  }

  @GetProductByIdDecorator()
  @Get(':id')
  findOneById(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @UpdateProductByIdDecorator()
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() body: Partial<UpdateProductDto>,
    @CurrentUser() currentUser: User,
  ) {
    return this.productsService.update(id, body, currentUser);
  }

  @DeleteProductByIdDecorator()
  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: User) {
    return this.productsService.remove(id, user);
  }
}
