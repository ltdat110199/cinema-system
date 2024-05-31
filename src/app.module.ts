import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MovieModule } from './movie/movie.module';
import { ShowtimeModule } from './showtime/showtime.module';
import { CommentModule } from './comment/comment.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { UserService } from './user/user.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { TheaterModule } from './theater/theater.module';
import { CinemaService } from './cinema/cinema.service';
import { CinemaModule } from './cinema/cinema.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MovieModule,
    ShowtimeModule,
    CommentModule,
    UserModule,
    PrismaModule,
    AuthModule,
    JwtModule,
    TheaterModule,
    CinemaModule,
  ],
  controllers: [AppController],
  providers: [AppService, AuthService, UserService, JwtService, CinemaService],
})
export class AppModule {}
