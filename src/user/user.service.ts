import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Role, User } from '@prisma/client';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getUserByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    return user || null;
  }
  async create(createUserDto: CreateUserDto) {
    const { role, ...userData } = createUserDto;
    const userRole = role ? role : Role.USER;
    const newUser = await this.prisma.user.create({
      data: {
        ...userData,
        role: userRole,
      },
    });
    return newUser;
  }

  async findAll() {
    const users = await this.prisma.user.findMany();
    const totalCount = users.length;
    return { users, totalCount };
  }

  findOne(id: number) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  update(id: number, data: UpdateUserDto) {
    return this.prisma.user.update({ where: { id }, data });
  }

  remove(id: number) {
    return this.prisma.user.delete({ where: { id } });
  }
  async search(keyword: string) {
    const users = await this.prisma.user.findMany({
      where: {
        OR: [
          { email: { contains: keyword, mode: 'insensitive' } },
          { name: { contains: keyword, mode: 'insensitive' } },
          { phone: { contains: keyword, mode: 'insensitive' } },
          { age: { contains: keyword, mode: 'insensitive' } },
        ],
      },
    });
    const totalCount = users.length;
    return { users, totalCount };
  }
}
