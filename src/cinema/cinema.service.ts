import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCinemaDto } from './dto/create-cinema.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class CinemaService {
  constructor(private prisma: PrismaService) {}

  async create(createCinemaDto: CreateCinemaDto) {
    const newCinema = await this.prisma.cinema.create({
      data: {
        name: createCinemaDto.name,
        address: createCinemaDto.address,
      },
    });
    return newCinema;
  }

  async findAll() {
    const listCinema = await this.prisma.cinema.findMany({
      include: {
        movies: {
          include: {
            theater: true,
          },
        },
      },
    });
    const totalCounts = await this.prisma.movie.groupBy({
      by: ['cinemaId'],
      _count: {
        id: true,
      },
    });
    const cinemas = listCinema.map((cinema) => {
      const totalCount =
        totalCounts.find((count) => count.cinemaId === cinema.id)?._count?.id ??
        0;

      return {
        ...cinema,
        totalCount,
      };
    });
    const totalCount = cinemas.length;
    return { cinemas, totalCount };
  }

  findOne(id: number) {
    return this.prisma.cinema.findUnique({ where: { id } });
  }

  update(id: number, data: Prisma.CinemaUpdateInput) {
    return this.prisma.cinema.update({ where: { id }, data });
  }

  remove(id: number) {
    return this.prisma.cinema.delete({ where: { id } });
  }
  async search(keyword: string) {
    const cinemas = await this.prisma.cinema.findMany({
      where: {
        OR: [
          { name: { contains: keyword, mode: 'insensitive' } },
          { address: { contains: keyword, mode: 'insensitive' } },
        ],
      },
    });
    const totalCount = cinemas.length;
    return { cinemas, totalCount };
  }
}
