import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
  NotFoundException,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto } from './dto';
import { Role } from '@prisma/client';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';

@Controller('users')
@UseGuards(JwtAuthGuard) // Áp dụng các guard cho toàn bộ controller
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @Roles(Role.ADMIN) // Chỉ cho phép ADMIN thực hiện hành động này
  async create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @Roles(Role.ADMIN) // Chỉ cho phép ADMIN thực hiện hành động này
  async findAll() {
    return this.userService.findAll();
  }
  @Get('search')
  async search(@Query('word') keyword: string) {
    return this.userService.search(keyword);
  }
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Put(':id')
  @Roles(Role.ADMIN) // Chỉ cho phép ADMIN thực hiện hành động này
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const updatedUser = await this.userService.update(+id, updateUserDto);
    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }
    return updatedUser;
  }

  @Delete(':id')
  @Roles(Role.ADMIN) // Chỉ cho phép ADMIN thực hiện hành động này
  async remove(@Param('id') id: string) {
    const deletedUser = await this.userService.remove(+id);
    if (!deletedUser) {
      throw new NotFoundException('User not found');
    }
    return deletedUser;
  }
}
