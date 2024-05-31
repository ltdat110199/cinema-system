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
import { CinemaService } from './cinema.service';
import { CreateCinemaDto } from './dto/create-cinema.dto';
import { Role, Prisma } from '@prisma/client';
import { Roles } from 'src/auth/decorator/roles.decorator';

@Controller('cinema')
export class CinemaController {
  constructor(private readonly cinemaService: CinemaService) {}

  @Post()
  @Roles(Role.ADMIN) // Chỉ cho phép ADMIN thực hiện hành động này
  async create(@Body() createCinemaDto: CreateCinemaDto) {
    return this.cinemaService.create(createCinemaDto);
  }

  @Get()
  @Roles(Role.ADMIN) // Chỉ cho phép ADMIN thực hiện hành động này
  async findAll() {
    return this.cinemaService.findAll();
  }
  @Get('search')
  async search(@Query('word') keyword: string) {
    return this.cinemaService.search(keyword);
  }
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.cinemaService.findOne(+id);
  }

  @Put(':id')
  @Roles(Role.ADMIN) // Chỉ cho phép ADMIN thực hiện hành động này
  async update(
    @Param('id') id: string,
    @Body() updateCinemaDto: Prisma.CinemaUpdateInput,
  ) {
    const updatedCinema = await this.cinemaService.update(+id, updateCinemaDto);
    if (!updatedCinema) {
      throw new NotFoundException('Cinema not found');
    }
    return updatedCinema;
  }

  @Delete(':id')
  @Roles(Role.ADMIN) // Chỉ cho phép ADMIN thực hiện hành động này
  async remove(@Param('id') id: string) {
    const deletedCinema = await this.cinemaService.remove(+id);
    if (!deletedCinema) {
      throw new NotFoundException('Cinema not found');
    }
    return deletedCinema;
  }
}
