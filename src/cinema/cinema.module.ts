import { Module } from '@nestjs/common';
import { CinemaController } from './cinema.controller';
import { CinemaService } from './cinema.service';

@Module({
  providers: [CinemaService],
  controllers: [CinemaController],
})
export class CinemaModule {}
