import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { MovieService } from './movie.service';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { Prisma, Role } from '@prisma/client';
import { CreateMovieDto } from './dto';

@Controller('movie')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Post()
  @Roles(Role.ADMIN) // Chỉ cho phép ADMIN thực hiện hành động này
  async create(@Body() createMovieDto: CreateMovieDto) {
    return this.movieService.create(createMovieDto);
  }

  @Get()
  @Roles(Role.ADMIN) // Chỉ cho phép ADMIN thực hiện hành động này
  async findAll() {
    return this.movieService.findAll();
  }
  @Get('search')
  async search(@Query('word') keyword: string) {
    return this.movieService.search(keyword);
  }
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.movieService.findOne(+id);
  }

  @Put(':id')
  @Roles(Role.ADMIN) // Chỉ cho phép ADMIN thực hiện hành động này
  async update(
    @Param('id') id: string,
    @Body() updateMovieDto: Prisma.MovieUpdateInput,
  ) {
    const updatedMovie = await this.movieService.update(+id, updateMovieDto);
    if (!updatedMovie) {
      throw new NotFoundException('Movie not found');
    }
    return updatedMovie;
  }

  @Delete(':id')
  @Roles(Role.ADMIN) // Chỉ cho phép ADMIN thực hiện hành động này
  async remove(@Param('id') id: string) {
    const deletedMovie = await this.movieService.remove(+id);
    if (!deletedMovie) {
      throw new NotFoundException('Movie not found');
    }
    return deletedMovie;
  }
}
