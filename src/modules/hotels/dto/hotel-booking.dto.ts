import { IsDateString, IsInt, IsOptional, IsString, IsUUID, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateHotelBookingDto {
  @ApiProperty({
    description: 'Hotel ID',
    example: 'cm123456789'
  })
  @IsUUID(4, { message: 'Hotel ID must be a valid UUID' })
  hotelId: string;

  @ApiProperty({
    description: 'Room ID',
    example: 'cm987654321'
  })
  @IsUUID(4, { message: 'Room ID must be a valid UUID' })
  roomId: string;

  @ApiProperty({
    description: 'Check-in date',
    example: '2024-01-15'
  })
  @IsDateString({}, { message: 'Check-in date must be a valid date' })
  checkInDate: string;

  @ApiProperty({
    description: 'Check-out date',
    example: '2024-01-17'
  })
  @IsDateString({}, { message: 'Check-out date must be a valid date' })
  checkOutDate: string;

  @ApiProperty({
    description: 'Number of guests',
    example: 2,
    minimum: 1
  })
  @IsInt({ message: 'Guests must be an integer' })
  @Min(1, { message: 'At least 1 guest is required' })
  guests: number;

  @ApiProperty({
    description: 'Special requests or notes',
    example: 'Late check-in requested',
    required: false
  })
  @IsOptional()
  @IsString({ message: 'Special requests must be a string' })
  specialRequests?: string;
}

export class HotelSearchDto {
  @ApiProperty({
    description: 'City to search in',
    example: 'Tashkent',
    required: false
  })
  @IsOptional()
  @IsString({ message: 'City must be a string' })
  city?: string;

  @ApiProperty({
    description: 'Check-in date for availability',
    example: '2024-01-15',
    required: false
  })
  @IsOptional()
  @IsDateString({}, { message: 'Check-in date must be a valid date' })
  checkInDate?: string;

  @ApiProperty({
    description: 'Check-out date for availability',
    example: '2024-01-17',
    required: false
  })
  @IsOptional()
  @IsDateString({}, { message: 'Check-out date must be a valid date' })
  checkOutDate?: string;

  @ApiProperty({
    description: 'Number of guests',
    example: 2,
    required: false
  })
  @IsOptional()
  @IsInt({ message: 'Guests must be an integer' })
  @Min(1, { message: 'At least 1 guest is required' })
  guests?: number;
}