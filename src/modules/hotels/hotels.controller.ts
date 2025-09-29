import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { HotelsService } from './hotels.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateHotelBookingDto } from './dto/hotel-booking.dto';

@ApiTags('Hotels')
@Controller('hotels')
export class HotelsController {
  constructor(private readonly hotelsService: HotelsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all hotels' })
  @ApiResponse({ status: 200, description: 'Hotels retrieved successfully' })
  async getAllHotels() {
    return this.hotelsService.getAllHotels();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get hotel by ID' })
  @ApiResponse({ status: 200, description: 'Hotel retrieved successfully' })
  async getHotelById(@Param('id') id: string) {
    return this.hotelsService.getHotelById(id);
  }

  @Get(':id/rooms')
  @ApiOperation({ summary: 'Get hotel rooms' })
  @ApiResponse({ status: 200, description: 'Hotel rooms retrieved successfully' })
  async getHotelRooms(@Param('id') hotelId: string) {
    return this.hotelsService.getHotelRooms(hotelId);
  }

  @Post('book')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Book a hotel room' })
  @ApiResponse({ status: 201, description: 'Hotel booking created successfully' })
  async bookHotel(@Body() createBookingDto: CreateHotelBookingDto, @Request() req) {
    return this.hotelsService.bookHotel(createBookingDto, req.user.userId);
  }

  @Get('bookings/my')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get my hotel bookings' })
  @ApiResponse({ status: 200, description: 'User hotel bookings retrieved successfully' })
  async getMyBookings(@Request() req) {
    return this.hotelsService.getUserBookings(req.user.userId);
  }
}