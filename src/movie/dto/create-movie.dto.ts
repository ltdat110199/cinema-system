import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsEmail,
  IsOptional,
  IsDate,
  IsInt,
  IsArray,
} from 'class-validator';

export class CreateMovieDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  title: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsDate()
  releaseDate: Date;

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

  @ApiProperty()
  @IsOptional()
  @IsInt()
  cinemaId: number;

  @ApiProperty()
  @IsOptional()
  @IsArray()
  theaterIds: number[];
}
