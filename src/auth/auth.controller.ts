import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  Res,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response, Request } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { AuthDto } from './dto/auth.dto';
import { CreateUserDto } from 'src/user/dto';
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @Post('login')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  login(@Body() authDto: AuthDto) {
    return this.authService.login(authDto);
  }

  @Post('logout')
  async logout(@Res() res: Response) {
    res.clearCookie('access_token');
    res.status(200).send('Logged out successfully');
  }

  @Post('refreshToken')
  async refreshToken(@Req() req: Request, @Res() res: Response) {
    const refreshToken = req.cookies['refresh_token'];

    if (!refreshToken) {
      return res.status(401).send('Refresh token is required');
    }

    try {
      const newTokens = await this.authService.refreshToken(refreshToken);
      res.cookie('access_token', newTokens.accessToken, { httpOnly: true });
      res.cookie('refresh_token', newTokens.refreshToken, { httpOnly: true });
      res.status(200).send('Token refreshed successfully');
    } catch (error) {
      return res.status(401).send('Invalid refresh token');
    }
  }
}
