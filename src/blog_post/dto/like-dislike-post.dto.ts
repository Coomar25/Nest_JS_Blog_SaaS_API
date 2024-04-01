import { IsBoolean, IsNotEmpty } from 'class-validator';

export class LikeDislikeDto {
  @IsBoolean()
  @IsNotEmpty()
  like?: boolean;

  @IsBoolean()
  @IsNotEmpty()
  dislike?: boolean;
}
