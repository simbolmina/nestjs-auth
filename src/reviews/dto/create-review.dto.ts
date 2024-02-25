import { IsInt, IsString, IsUUID, Min, Max } from 'class-validator';

export class CreateReviewDto {
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @IsString()
  content: string;

  @IsUUID()
  profileId: string;

  @IsUUID()
  reviewedProfileId: string;
}
