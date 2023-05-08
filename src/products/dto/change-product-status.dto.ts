import { IsString } from 'class-validator';

export class ChangeProductStatusDto {
  @IsString()
  status: string;
}
