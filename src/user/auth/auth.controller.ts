import { UserTokenInfo } from './../decorators/user.decorator';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { UserType } from '@prisma/client';
import { generateProductKeyDto, signinDto, SignupDto } from '../dtos/auth.dto';
import { AuthService } from './auth.service';
import * as bcrypt from 'bcryptjs';
import { User } from '../decorators/user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup/:userType')
  async signup(@Body() body: SignupDto, @Param('userType') userType: UserType) {
    if (userType !== UserType.BUYER) {
      if (!body.productKey) {
        throw new UnauthorizedException();
      }

      const validProductKey = `${body.email}-${userType}-${process.env.GENERATE_PRODUCT_SECRET_KEY}`;

      const isValidProductKey = await bcrypt.compare(
        validProductKey,
        body.productKey,
      );

      if (!isValidProductKey) {
        throw new UnauthorizedException();
      }
    }

    return this.authService.signup(body);
  }

  @Post('signin')
  signin(@Body() body: signinDto) {
    return this.authService.signin(body);
  }

  @Post('key')
  generateProductKey(@Body() { email, userType }: generateProductKeyDto) {
    return this.authService.generateProductKey(email, userType);
  }

  @Get('me')
  me(@User() user: UserTokenInfo) {
    return user;
  }
}
