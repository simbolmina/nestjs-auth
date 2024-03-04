import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AddressesService } from './addresses.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/users/decorators/current-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@ApiTags('addresses')
@Controller('addresses')
export class AddressesController {
  constructor(private readonly addressesService: AddressesService) {}

  @Post()
  create(
    @CurrentUser() user: User,
    @Body() createAddressDto: CreateAddressDto,
  ) {
    return this.addressesService.create(user, createAddressDto);
  }

  @Get('/my-addresses')
  getCurrentUsersAddress(@CurrentUser() user: any) {
    return this.addressesService.getCurrentUsersAddress(user);
  }

  @Get(':addressId')
  findOne(@CurrentUser() user: User, @Param('addressId') addressId: string) {
    return this.addressesService.findOne(user, addressId);
  }

  @Patch(':addressId')
  update(
    @CurrentUser() user: User,
    @Param('addressId') addressId: string,
    @Body() updateAddressDto: UpdateAddressDto,
  ) {
    return this.addressesService.update(user, addressId, updateAddressDto);
  }

  @Delete(':addressId')
  remove(@CurrentUser() user: User, @Param('addressId') addressId: string) {
    return this.addressesService.remove(user, addressId);
  }
}
