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
import { GetFeaturedProductdDto } from './dto/get-product.dto';

@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @Serialize(ProductDto)
  createProduct(@Body() body: CreateProductDto, @CurrentUser() user: User) {
    return this.productsService.create(body, user);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  changeProductStatus(
    @Param('id') id: string,
    @Body() body: ChangeProductStatusDto,
  ) {
    return this.productsService.changeStatus(id, body);
  }

  @Get()
  getProducts(@Query() query: GetFeaturedProductdDto) {
    return this.productsService.createQuery(query);
  }

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: UpdateProductDto) {
    return this.productsService.update(+id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }
}
