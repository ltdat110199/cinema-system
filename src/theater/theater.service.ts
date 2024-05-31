import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTheaterDto } from './dto/create-theater.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class TheaterService {
  constructor(private prisma: PrismaService) {}

  async create(createTheaterDto: CreateTheaterDto) {
    return this.prisma.theater.create({ data: createTheaterDto });
  }

  async findAll() {
    return this.prisma.theater.findMany();
  }

  async findOne(id: number) {
    return this.prisma.theater.findUnique({ where: { id } });
  }

  async update(id: number, data: Prisma.TheaterUpdateInput) {
    return this.prisma.theater.update({
      where: { id },
      data,
    });
  }

  async remove(id: number) {
    return this.prisma.theater.delete({ where: { id } });
  }
  async search(keyword: string) {
    const movies = await this.prisma.theater.findMany({
      where: {
        OR: [{ name: { contains: keyword, mode: 'insensitive' } }],
      },
    });
    const totalCount = movies.length;
    return { movies, totalCount };
  }
}
