import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsEmail,
  IsOptional,
  IsInt,
} from 'class-validator';

export class UpdateMovieDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  title?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  description?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  releaseDate?: string;

  @ApiProperty()
  @IsOptional()
  @IsInt()
  duration: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  trailerUrl: string;

  @ApiProperty()
  @IsOptional()
  @IsInt()
  normalPrice: number;

  @ApiProperty()
  @IsOptional()
  @IsInt()
  vipPrice: number;
}
