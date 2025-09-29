import { Controller, Get, Query, Param, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { FlightsService } from './flights.service';
import { SearchFlightsDto } from './dto/search-flights.dto';

@ApiTags('Flights')
@Controller('flights')
export class FlightsController {
  constructor(private readonly flightsService: FlightsService) {}

  @Get('search')
  @ApiOperation({ summary: 'Search for available flights' })
  @ApiQuery({ name: 'departureAirport', example: 'JFK' })
  @ApiQuery({ name: 'arrivalAirport', example: 'LAX' })
  @ApiQuery({ name: 'departureDate', example: '2025-12-01' })
  @ApiQuery({ name: 'passengers', example: 1 })
  @ApiQuery({ name: 'returnDate', required: false, example: '2025-12-05' })
  @ApiQuery({ name: 'seatClass', required: false, example: 'ECONOMY' })
  @ApiResponse({
    status: 200,
    description: 'Flights found successfully',
    schema: {
      example: [
        {
          id: 'flight123',
          flightNumber: 'AA100',
          airline: {
            name: 'American Airlines',
            code: 'AA',
            logo: 'https://example.com/logo.png',
          },
          aircraft: {
            model: 'Boeing 737-800',
            manufacturer: 'Boeing',
          },
          departure: {
            airport: {
              code: 'JFK',
              name: 'John F. Kennedy International Airport',
              city: 'New York',
            },
            time: '2025-12-01T08:00:00Z',
          },
          arrival: {
            airport: {
              code: 'LAX',
              name: 'Los Angeles International Airport',
              city: 'Los Angeles',
            },
            time: '2025-12-01T11:30:00Z',
          },
          duration: 330,
          prices: {
            economy: 299.99,
            business: 799.99,
            firstClass: 1299.99,
          },
          availableSeats: {
            economy: 144,
            business: 16,
            firstClass: 0,
          },
          status: 'SCHEDULED',
        },
      ],
    },
  })
  async searchFlights(@Query() searchDto: SearchFlightsDto) {
    return this.flightsService.searchFlights(searchDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get flight details by ID' })
  @ApiResponse({
    status: 200,
    description: 'Flight details retrieved successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Flight not found',
  })
  async getFlightById(@Param('id') id: string) {
    const flight = await this.flightsService.findById(id);
    
    if (!flight) {
      throw new NotFoundException('Flight not found');
    }

    return flight;
  }
}