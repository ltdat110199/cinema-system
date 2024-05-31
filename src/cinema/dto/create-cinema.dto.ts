import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsInt } from 'class-validator';

export class CreateCinemaDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  capacity: number;

  @ApiProperty()
  @IsOptional()
  @IsInt()
  cinemaId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  address: string;
}
