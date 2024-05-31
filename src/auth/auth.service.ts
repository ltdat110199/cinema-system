import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Role, User } from '@prisma/client';
import { CreateUserDto, UpdateUserDto } from 'src/user/dto';
import { AuthDto } from './dto/auth.dto';
import * as argon from 'argon2';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(createUserDto: CreateUserDto) {
    const hashedPassword = await argon.hash(createUserDto.password);

    try {
      const user = await this.prismaService.user.create({
        data: {
          email: createUserDto.email,
          password: hashedPassword,
          name: createUserDto.name,
          age: createUserDto.age,
          avatar: createUserDto.avatar,
          phone: createUserDto.phone,
          role: createUserDto.role,
        },
        select: {
          id: true,
          email: true,
          name: true,
          age: true,
          avatar: true,
          phone: true,
          createdAt: true,
          role: true,
        },
      });
      return await this.signJwtToken(user.id, user.email, user.role);
    } catch (error) {
      if (error.code === 'P2002' && error.meta.target.includes('email')) {
        throw new ForbiddenException('Email already in use');
      }
      throw error;
    }
  }

  async login(loginDto: AuthDto) {
    const user = await this.prismaService.user.findUnique({
      where: { email: loginDto.email },
    });

    if (!user) {
      throw new ForbiddenException('Invalid credentials');
    }

    const passwordMatched = await argon.verify(
      user.password,
      loginDto.password,
    );
    if (!passwordMatched) {
      throw new ForbiddenException('Invalid credentials');
    }

    return await this.signJwtToken(user.id, user.email, user.role);
  }

  async signJwtToken(
    userId: number,
    email: string,
    role: Role,
  ): Promise<{ accessToken: string }> {
    const payload = { sub: userId, email, role };
    const jwtString = await this.jwtService.signAsync(payload, {
      expiresIn: '60m',
      secret: this.configService.get('JWT_SECRET'),
    });
    return {
      accessToken: jwtString,
    };
  }

  async updateUser(
    userId: number,
    updateUserDto: UpdateUserDto,
  ): Promise<User> {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const hashedPassword = await argon.hash(updateUserDto.password);

    return this.prismaService.user.update({
      where: { id: userId },
      data: {
        email: updateUserDto.email,
        password: hashedPassword,
        name: updateUserDto.name,
        age: updateUserDto.age,
        avatar: updateUserDto.avatar,
        phone: updateUserDto.phone,
        role: updateUserDto.role,
      },
    });
  }
  async refreshToken(refreshToken: string) {
    const decoded = this.jwtService.verify(refreshToken);
    if (!decoded || !decoded.userId) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const user = await this.prismaService.user.findUnique({
      where: { id: decoded.userId },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const accessToken = this.generateAccessToken(user.id, user.email);

    return {
      accessToken,
      refreshToken,
    };
  }

  private generateAccessToken(userId: number, email: string) {
    const payload = { sub: userId, email };
    return this.jwtService.sign(payload, {
      expiresIn: this.configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME'),
    });
  }
}
