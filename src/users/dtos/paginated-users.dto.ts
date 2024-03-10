import { ApiProperty } from '@nestjs/swagger';
import { MetaDto } from 'src/common/dtos/meta.dto';
import { UserDto } from './user.dto';

export class PaginatedUserDto {
  @ApiProperty({ type: MetaDto })
  meta: MetaDto;

  @ApiProperty({ type: [UserDto] }) // Use your existing User DTO
  data: UserDto[];
}
