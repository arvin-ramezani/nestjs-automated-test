import { PropertyType } from '@prisma/client';
import { Exclude, Expose, Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator';

export class HomeResponseDto {
  id: number;
  address: string;
  image: string;

  @Exclude()
  number_of_bedrooms: number;

  @Expose({ name: 'numberOfBedrooms' })
  numberOfBedrooms() {
    return this.number_of_bedrooms;
  }

  @Expose({ name: 'numberOfBathrooms' })
  numberOfBathrooms() {
    return this.number_of_bathrooms;
  }
  @Exclude()
  number_of_bathrooms: number;

  city: string;
  listed_date: Date;
  price: number;

  @Expose({ name: 'lasnSize' })
  landSize() {
    return this.land_size;
  }

  @Exclude()
  land_size: number;

  propertyType: string;

  @Exclude()
  created_at: Date;
  @Exclude()
  updated_at: Date;
  @Exclude()
  realtor_id: number;

  constructor(partial: Partial<HomeResponseDto>) {
    Object.assign(this, partial);
  }
}

export class Image {
  @IsString()
  @IsNotEmpty()
  url: string;
}

export class CreateHomeResponseDto {
  @IsNotEmpty()
  @IsString()
  address: string;

  @IsNumber()
  @IsPositive()
  numberOfBedrooms: number;

  @IsNumber()
  @IsPositive()
  numberOfBathrooms: number;

  @IsNotEmpty()
  @IsString()
  city: string;

  @IsNumber()
  @IsPositive()
  price: number;
  @IsNumber()
  @IsPositive()
  landSize: number;

  @IsEnum(PropertyType)
  propertyType: PropertyType;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Image)
  images: Image[];

  constructor(partial: Partial<CreateHomeResponseDto>) {
    Object.assign(this, partial);
  }
}

export class UpdateHomeResponseDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  address?: string;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  numberOfBedrooms?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  numberOfBathrooms?: number;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  city?: string;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  @IsOptional()
  price?: number;
  @IsOptional()
  @IsNumber()
  @IsPositive()
  landSize?: number;

  @IsOptional()
  @IsEnum(PropertyType)
  propertyType?: PropertyType;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Image)
  images?: Image[];

  constructor(partial: Partial<UpdateHomeResponseDto>) {
    Object.assign(this, partial);
  }
}

export class InquireDto {
  @IsNotEmpty()
  @IsString()
  message: string;
}
