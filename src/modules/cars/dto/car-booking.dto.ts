import { IsDateString, IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCarBookingDto {
  @ApiProperty({
    description: 'Car rental ID',
    example: 'cm123456789'
  })
  @IsUUID(4, { message: 'Car ID must be a valid UUID' })
  carId: string;

  @ApiProperty({
    description: 'Pickup date and time',
    example: '2024-01-15T09:00:00Z'
  })
  @IsDateString({}, { message: 'Pickup date must be a valid date' })
  pickupDate: string;

  @ApiProperty({
    description: 'Return date and time',
    example: '2024-01-17T18:00:00Z'
  })
  @IsDateString({}, { message: 'Return date must be a valid date' })
  returnDate: string;

  @ApiProperty({
    description: 'Pickup location',
    example: 'Tashkent International Airport'
  })
  @IsString({ message: 'Pickup location must be a string' })
  pickupLocation: string;

  @ApiProperty({
    description: 'Return location',
    example: 'Tashkent International Airport'
  })
  @IsString({ message: 'Return location must be a string' })
  returnLocation: string;

  @ApiProperty({
    description: 'Special requests or notes',
    example: 'Need child car seat',
    required: false
  })
  @IsOptional()
  @IsString({ message: 'Special requests must be a string' })
  specialRequests?: string;
}