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
import { TheaterService } from './theater.service';
import { Role, Prisma } from '@prisma/client';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { CreateTheaterDto } from './dto/create-theater.dto';

@Controller('theater')
export class TheaterController {
  constructor(private readonly theaterService: TheaterService) {}

  @Post()
  @Roles(Role.ADMIN) // Chỉ cho phép ADMIN thực hiện hành động này
  async create(@Body() createTheaterDto: CreateTheaterDto) {
    return this.theaterService.create(createTheaterDto);
  }

  @Get()
  @Roles(Role.ADMIN) // Chỉ cho phép ADMIN thực hiện hành động này
  async findAll() {
    return this.theaterService.findAll();
  }
  @Get('search')
  async search(@Query('word') keyword: string) {
    return this.theaterService.search(keyword);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.theaterService.findOne(+id);
  }

  @Put(':id')
  @Roles(Role.ADMIN) // Chỉ cho phép ADMIN thực hiện hành động này
  async update(
    @Param('id') id: string,
    @Body() updateTheaterDto: Prisma.TheaterUpdateInput,
  ) {
    const updatedTheater = await this.theaterService.update(
      +id,
      updateTheaterDto,
    );
    if (!updatedTheater) {
      throw new NotFoundException('Theater not found');
    }
    return updatedTheater;
  }

  @Delete(':id')
  @Roles(Role.ADMIN) // Chỉ cho phép ADMIN thực hiện hành động này
  async remove(@Param('id') id: string) {
    const deletedTheater = await this.theaterService.remove(+id);
    if (!deletedTheater) {
      throw new NotFoundException('Theater not found');
    }
    return deletedTheater;
  }
}
