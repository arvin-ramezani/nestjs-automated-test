import * as JWT from 'jsonwebtoken';
import { ConflictException, HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { UserType } from '@prisma/client';

interface singupParams {
  name: string;
  phone: string;
  email: string;
  password: string;
}

interface signinParams {
  email: string;
  password: string;
}

@Injectable()
export class AuthService {
  constructor(private readonly prismaService: PrismaService) {}

  async signup({ email, password, name, phone }: singupParams) {
    const existingUser = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });
    if (existingUser) {
      throw new ConflictException();
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.prismaService.user.create({
      data: {
        name,
        phone,
        email,
        password: hashedPassword,
        user_type: UserType.BUYER,

        // userType: UserType.BUYER,
      },
    });

    return await this.generateJWT(name, user.id);
  }

  async signin({ email, password }: signinParams) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      throw new HttpException('Invalid Credentials', 404);
    }

    const hashedPassword = user.password;
    const isValidPassword = await bcrypt.compare(password, hashedPassword);

    if (!isValidPassword) {
      throw new HttpException('Invalid Credentials', 400);
    }

    return await this.generateJWT(user.name, user.id);
  }

  async generateProductKey(email: string, userType: UserType) {
    const string = `${email}-${userType}-${process.env.GENERATE_PRODUCT_SECRET_KEY}`;

    return bcrypt.hash(string, 10);
  }

  async generateJWT(name: string, id: number) {
    return JWT.sign(
      {
        name,
        id,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: 3600000000 },
    );
  }
}
