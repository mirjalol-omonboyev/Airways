import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CarsService } from './cars.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateCarBookingDto } from './dto/car-booking.dto';

@ApiTags('Car Rental')
@Controller('cars')
export class CarsController {
  constructor(private readonly carsService: CarsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all available cars' })
  @ApiResponse({ status: 200, description: 'Cars retrieved successfully' })
  async getAllCars() {
    return this.carsService.getAllCars();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get car by ID' })
  @ApiResponse({ status: 200, description: 'Car retrieved successfully' })
  async getCarById(@Param('id') id: string) {
    return this.carsService.getCarById(id);
  }

  @Post('book')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Book a car' })
  @ApiResponse({ status: 201, description: 'Car booking created successfully' })
  async bookCar(@Body() createBookingDto: CreateCarBookingDto, @Request() req) {
    return this.carsService.bookCar(createBookingDto, req.user.userId);
  }

  @Get('bookings/my')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get my car bookings' })
  @ApiResponse({ status: 200, description: 'User car bookings retrieved successfully' })
  async getMyBookings(@Request() req) {
    return this.carsService.getUserBookings(req.user.userId);
  }
}