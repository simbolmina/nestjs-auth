import { ApiProperty } from '@nestjs/swagger';
import { MetaDto } from 'src/common/dto/meta.dto';
import { UserRoles, UserStatus } from '../entities/user.entity';
import { Expose } from 'class-transformer';

export class GetAllUserDto {
  @Expose()
  @ApiProperty({
    example: '60ff5cf8b5972c001f7741a8',
    description: 'The unique id of the user',
    type: String,
  })
  id: string;

  @Expose()
  @ApiProperty({
    example: 'user@example.com',
    description: 'The email of the user',
    type: String,
  })
  email: string;

  @Expose()
  @ApiProperty({
    description: 'The status of the user account',
    type: String,
  })
  status: UserStatus;

  @Expose()
  @ApiProperty({
    description: 'The role of the user',
    enum: UserRoles,
  })
  role: UserRoles;
}

export class PaginatedUserDto {
  @ApiProperty({ type: MetaDto })
  meta: MetaDto;

  @ApiProperty({ type: [GetAllUserDto] }) // Use your existing User DTO
  data: GetAllUserDto[];
}
