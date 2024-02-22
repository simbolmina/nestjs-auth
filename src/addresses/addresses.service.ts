import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { User } from 'src/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Address } from './entities/address.entity';
import { Repository } from 'typeorm';
import { AddressResponseDto } from './dto/address-response.dto';
import { plainToClass } from 'class-transformer';

@Injectable()
export class AddressesService {
  constructor(
    @InjectRepository(Address)
    private repo: Repository<Address>,
  ) {}

  async create(
    user: User,
    createAddressDto: CreateAddressDto,
  ): Promise<AddressResponseDto> {
    const address = this.repo.create({ user, ...createAddressDto });
    const savedAddress = await this.repo.save(address);
    const responseDto = plainToClass(AddressResponseDto, savedAddress, {
      excludeExtraneousValues: true,
    });
    return responseDto;
  }

  async getCurrentUsersAddress(user: User): Promise<Address[]> {
    return await this.repo.find({
      where: { userId: user.id }, // Adjust the query to match on userId
    });
  }

  async findOne(user: User, id: string): Promise<Address> {
    const address = await this.repo.findOneOrFail({
      where: { id },
    });

    if (!address) {
      throw new NotFoundException('No address found for this id');
    }

    if (address.userId !== user.id) {
      throw new ForbiddenException('you dont own this address');
    }

    return address;
  }

  async update(
    user: User,
    id: string,
    updateAddressDto: UpdateAddressDto,
  ): Promise<Address> {
    const address = await this.repo.findOneOrFail({
      where: { id },
    });
    if (!address) {
      throw new NotFoundException('No address found for this id');
    }

    if (address.userId !== user.id) {
      throw new ForbiddenException('you dont own this address');
    }
    this.repo.merge(address, updateAddressDto);
    return await this.repo.save(address);
  }

  async remove(user: User, id: string): Promise<void> {
    const address = await this.repo.findOneOrFail({
      where: { id },
    });

    if (!address) {
      throw new NotFoundException('No address found for this id');
    }

    if (address.userId !== user.id) {
      throw new ForbiddenException('you dont own this address');
    }
    await this.repo.delete(address.id);
  }
}
