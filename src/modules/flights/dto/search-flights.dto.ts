import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsDateString, IsNumber, Min, Max } from 'class-validator';
import { Transform } from 'class-transformer';

export class SearchFlightsDto {
  @ApiProperty({
    example: 'JFK',
    description: 'Departure airport code (IATA)',
  })
  @IsString()
  @IsNotEmpty()
  departureAirport: string;

  @ApiProperty({
    example: 'LAX',
    description: 'Arrival airport code (IATA)',
  })
  @IsString()
  @IsNotEmpty()
  arrivalAirport: string;

  @ApiProperty({
    example: '2025-12-01',
    description: 'Departure date (YYYY-MM-DD)',
  })
  @IsDateString()
  @IsNotEmpty()
  departureDate: string;

  @ApiProperty({
    example: '2025-12-05',
    description: 'Return date (YYYY-MM-DD) - optional for one-way flights',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  returnDate?: string;

  @ApiProperty({
    example: 1,
    description: 'Number of passengers',
    minimum: 1,
    maximum: 9,
  })
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(1)
  @Max(9)
  passengers: number;

  @ApiProperty({
    example: 'ECONOMY',
    description: 'Seat class preference',
    enum: ['ECONOMY', 'BUSINESS', 'FIRST_CLASS'],
    required: false,
  })
  @IsOptional()
  @IsString()
  seatClass?: string;
}