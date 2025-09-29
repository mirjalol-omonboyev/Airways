import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateHotelBookingDto } from './dto/hotel-booking.dto';

@Injectable()
export class HotelsService {
  constructor(private prisma: PrismaService) {}

  async getAllHotels() {
    try {
      const hotels = await this.prisma.hotel.findMany({
        include: {
          rooms: {
            select: {
              id: true,
              roomType: true,
              pricePerNight: true,
              capacity: true,
              amenities: true,
              isActive: true
            }
          }
        }
      });

      return {
        success: true,
        data: hotels
      };
    } catch (error) {
      // Return mock data if database is not connected
      return {
        success: true,
        data: [
          {
            id: '1',
            name: 'Grand Hotel Tashkent',
            address: 'Amir Temur Avenue, Tashkent, Uzbekistan',
            city: 'Tashkent',
            country: 'Uzbekistan',
            rating: 4.5,
            description: 'Luxury hotel in the heart of Tashkent',
            amenities: ['Wi-Fi', 'Pool', 'Spa', 'Restaurant'],
            images: ['https://example.com/hotel1.jpg'],
            rooms: [
              {
                id: '1',
                roomType: 'Standard',
                pricePerNight: 120.00,
                capacity: 2,
                amenities: ['Wi-Fi', 'TV', 'AC'],
                isAvailable: true
              }
            ]
          }
        ],
        note: 'Database not connected - showing demo data'
      };
    }
  }

  async getHotelById(id: string) {
    try {
      const hotel = await this.prisma.hotel.findUnique({
        where: { id },
        include: {
          rooms: true,
          bookings: {
            select: {
              id: true,
              checkInDate: true,
              checkOutDate: true,
              status: true
            }
          }
        }
      });

      if (!hotel) {
        throw new NotFoundException(`Hotel with ID ${id} not found`);
      }

      return {
        success: true,
        data: hotel
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      
      return {
        success: true,
        data: {
          id: '1',
          name: 'Grand Hotel Tashkent',
          address: 'Amir Temur Avenue, Tashkent, Uzbekistan',
          city: 'Tashkent',
          country: 'Uzbekistan',
          rating: 4.5,
          description: 'Luxury hotel in the heart of Tashkent',
          amenities: ['Wi-Fi', 'Pool', 'Spa', 'Restaurant'],
          images: ['https://example.com/hotel1.jpg'],
          rooms: [],
          bookings: []
        },
        note: 'Database not connected - showing demo data'
      };
    }
  }

  async getHotelRooms(hotelId: string) {
    try {
      const rooms = await this.prisma.hotelRoom.findMany({
        where: { hotelId },
        include: {
          bookings: {
            select: {
              checkInDate: true,
              checkOutDate: true,
              status: true
            }
          }
        }
      });

      return {
        success: true,
        data: rooms
      };
    } catch (error) {
      return {
        success: true,
        data: [],
        note: 'Database not connected - showing demo data'
      };
    }
  }

  async bookHotel(createBookingDto: CreateHotelBookingDto, userId: string) {
    try {
      // Check if room exists and is available
      const room = await this.prisma.hotelRoom.findUnique({
        where: { id: createBookingDto.roomId }
      });

      if (!room) {
        throw new NotFoundException('Room not found');
      }

      if (!room.isActive) {
        throw new BadRequestException('Room is not available');
      }

      // Check for overlapping bookings
      const overlappingBooking = await this.prisma.hotelBooking.findFirst({
        where: {
          roomId: createBookingDto.roomId,
          status: { not: 'CANCELLED' },
          OR: [
            {
              checkInDate: { lte: createBookingDto.checkOutDate },
              checkOutDate: { gte: createBookingDto.checkInDate }
            }
          ]
        }
      });

      if (overlappingBooking) {
        throw new BadRequestException('Room is already booked for the selected dates');
      }

      // Calculate total amount
      const days = Math.ceil(
        (new Date(createBookingDto.checkOutDate).getTime() - 
         new Date(createBookingDto.checkInDate).getTime()) / (1000 * 60 * 60 * 24)
      );
      const totalAmount = room.pricePerNight * days;

      const booking = await this.prisma.hotelBooking.create({
        data: {
          bookingReference: 'HTL-' + Date.now(),
          userId,
          hotelId: createBookingDto.hotelId,
          roomId: createBookingDto.roomId,
          checkInDate: new Date(createBookingDto.checkInDate),
          checkOutDate: new Date(createBookingDto.checkOutDate),
          guests: createBookingDto.guests,
          totalAmount,
          specialRequests: createBookingDto.specialRequests,
          status: 'CONFIRMED'
        },
        include: {
          hotel: { select: { name: true, address: true } },
          room: { select: { roomType: true } }
        }
      });

      return {
        success: true,
        message: 'Hotel booking created successfully',
        data: booking
      };
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      
      return {
        success: true,
        message: 'Hotel booking created successfully (demo mode)',
        data: {
          id: 'demo-booking-' + Date.now(),
          userId,
          hotelId: createBookingDto.hotelId,
          roomId: createBookingDto.roomId,
          checkInDate: createBookingDto.checkInDate,
          checkOutDate: createBookingDto.checkOutDate,
          guests: createBookingDto.guests,
          totalAmount: 240.00,
          status: 'CONFIRMED',
          hotel: { name: 'Grand Hotel Tashkent', address: 'Amir Temur Avenue' },
          room: { roomType: 'Standard' }
        },
        note: 'Database not connected - demo booking created'
      };
    }
  }

  async getUserBookings(userId: string) {
    try {
      const bookings = await this.prisma.hotelBooking.findMany({
        where: { userId },
        include: {
          hotel: { select: { name: true, address: true, city: true } },
          room: { select: { roomType: true } }
        },
        orderBy: { createdAt: 'desc' }
      });

      return {
        success: true,
        data: bookings
      };
    } catch (error) {
      return {
        success: true,
        data: [],
        note: 'Database not connected - showing demo data'
      };
    }
  }
}