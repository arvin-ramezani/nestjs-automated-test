import { AuthGuard } from './../guards/auth.guard';
import { UserTokenInfo } from './../user/decorators/user.decorator';
import {
  CreateHomeResponseDto,
  HomeResponseDto,
  InquireDto,
  UpdateHomeResponseDto,
} from './dtos/home.dto';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UnauthorizedException,
} from '@nestjs/common';
import { HomeService } from './home.service';
import { PropertyType, UserType } from '@prisma/client';
import { User } from 'src/user/decorators/user.decorator';
import { Roles } from 'src/decorators/roles.decorator';

@Controller('home')
export class HomeController {
  constructor(private readonly homeService: HomeService) {}

  @Get()
  getHomes(
    @Query('city') city?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('propertyType') propertyType?: PropertyType,
  ): Promise<HomeResponseDto[]> {
    const price =
      minPrice || maxPrice
        ? {
            ...(minPrice && { gte: parseFloat(minPrice) }),
            ...(maxPrice && { lte: parseFloat(maxPrice) }),
          }
        : undefined;

    const filters = {
      ...(city && { city }),
      ...(price && { price }),

      ...(propertyType && { propertyType }),
    };

    return this.homeService.getHomes(filters);
  }

  @Get(':id')
  getOneHome(@Param('id') id: string): Promise<HomeResponseDto> {
    return this.homeService.getOneHomeById(id);
  }

  @Roles(UserType.REALTOR)
  @Post()
  createHome(
    @Body() body: CreateHomeResponseDto,
    @User() user: UserTokenInfo,
  ): Promise<CreateHomeResponseDto> {
    return this.homeService.createHome(body, user.id);
  }

  @Roles(UserType.REALTOR)
  @Put(':id')
  async updateHome(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateHomeResponseDto,
    @User() user: UserTokenInfo,
  ): Promise<UpdateHomeResponseDto> {
    const realtor = await this.homeService.getRealtorByHomeId(id);

    if (realtor.id !== user.id) {
      throw new UnauthorizedException();
    }

    return this.homeService.updateHome(id, body);
  }

  @Roles(UserType.REALTOR)
  @Delete(':id')
  async deleteHome(
    @Param('id', ParseIntPipe) id: number,
    @User() user: UserTokenInfo,
  ) {
    const realtor = await this.homeService.getRealtorByHomeId(id);

    if (realtor.id !== user.id) {
      throw new UnauthorizedException();
    }

    return this.homeService.deleteHome(id);
  }

  @Roles(UserType.BUYER)
  @Post(':id/inquire')
  inquire(
    @Param('id', ParseIntPipe) homeId: number,
    @User() user: UserTokenInfo,
    @Body() { message }: InquireDto,
  ) {
    return this.homeService.inquire(user, homeId, message);
  }

  @Roles(UserType.REALTOR)
  @Get(':id/messages')
  async getHomeMessages(
    @Param('id', ParseIntPipe) homeId: number,
    @User() user: UserTokenInfo,
  ) {
    const realtor = await this.homeService.getRealtorByHomeId(homeId);

    if (realtor.id !== user.id) {
      throw new UnauthorizedException();
    }
    return this.homeService.getMessagesByHomeId(homeId);
  }
}
