import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMovieDto } from './dto';
import { Prisma } from '@prisma/client';
@Injectable()
export class MovieService {
  constructor(private prisma: PrismaService) {}

  async create(createMovieDto: CreateMovieDto) {
    const { theaterIds, ...movieData } = createMovieDto;

    const theaters = await this.prisma.theater.findMany({
      where: {
        id: {
          in: theaterIds,
        },
      },
    });

    if (theaters.length !== theaterIds.length) {
      throw new NotFoundException('One or more theaters not found');
    }

    const movie = await this.prisma.movie.create({
      data: {
        ...movieData,
        theater: {
          connect: theaterIds.map((id) => ({ id })),
        },
      },
      include: {
        theater: true,
      },
    });

    return movie;
  }

  async findAll() {
    const movies = await this.prisma.movie.findMany({
      include: { theater: true },
    });
    const totalCount = movies.length;
    return { movies, totalCount };
  }

  async findOne(id: number) {
    const movie = await this.prisma.movie.findUnique({ where: { id } });

    if (!movie) {
      throw new NotFoundException('Movie not found');
    }
    return movie;
  }

  async update(id: number, data: Prisma.UserUpdateInput) {
    const updatedMovie = await this.prisma.movie.update({
      where: { id },
      data,
    });
    return updatedMovie;
  }

  async remove(id: number) {
    const movie = await this.prisma.movie.findUnique({ where: { id } });

    if (!movie) {
      throw new NotFoundException('Movie not found');
    }
    const deletedMovie = await this.prisma.movie.delete({ where: { id } });
    return deletedMovie;
  }

  async search(keyword: string) {
    const movies = await this.prisma.movie.findMany({
      where: {
        OR: [
          { title: { contains: keyword, mode: 'insensitive' } },
          { duration: parseInt(keyword) || undefined },
          { releaseDate: { equals: new Date(keyword) } },
        ],
      },
    });
    const totalCount = movies.length;
    return { movies, totalCount };
  }
}
