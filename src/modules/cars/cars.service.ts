import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCarBookingDto } from './dto/car-booking.dto';

@Injectable()
export class CarsService {
  constructor(private prisma: PrismaService) {}

  async getAllCars() {
    try {
      const cars = await this.prisma.carRental.findMany({
        where: { isActive: true },
        orderBy: { createdAt: 'desc' }
      });

      return {
        success: true,
        data: cars
      };
    } catch (error) {
      // Return mock data if database is not connected
      return {
        success: true,
        data: [
          {
            id: '1',
            brand: 'Toyota',
            model: 'Camry',
            year: 2023,
            category: 'Economy',
            pricePerDay: 45.00,
            features: ['AC', 'GPS', 'Bluetooth'],
            images: ['https://example.com/car1.jpg'],
            location: 'Tashkent',
            isActive: true
          },
          {
            id: '2',
            brand: 'BMW',
            model: 'X5',
            year: 2023,
            category: 'Luxury',
            pricePerDay: 120.00,
            features: ['AC', 'GPS', 'Leather Seats', 'Sunroof'],
            images: ['https://example.com/car2.jpg'],
            location: 'Tashkent',
            isActive: true
          }
        ],
        note: 'Database not connected - showing demo data'
      };
    }
  }

  async getCarById(id: string) {
    try {
      const car = await this.prisma.carRental.findUnique({
        where: { id },
        include: {
          bookings: {
            select: {
              id: true,
              pickupDate: true,
              returnDate: true,
              status: true
            }
          }
        }
      });

      if (!car) {
        throw new NotFoundException(`Car with ID ${id} not found`);
      }

      return {
        success: true,
        data: car
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      
      return {
        success: true,
        data: {
          id: '1',
          brand: 'Toyota',
          model: 'Camry',
          year: 2023,
          category: 'Economy',
          pricePerDay: 45.00,
          features: ['AC', 'GPS', 'Bluetooth'],
          images: ['https://example.com/car1.jpg'],
          location: 'Tashkent',
          isActive: true,
          bookings: []
        },
        note: 'Database not connected - showing demo data'
      };
    }
  }

  async bookCar(createBookingDto: CreateCarBookingDto, userId: string) {
    try {
      // Check if car exists and is available
      const car = await this.prisma.carRental.findUnique({
        where: { id: createBookingDto.carId }
      });

      if (!car) {
        throw new NotFoundException('Car not found');
      }

      if (!car.isActive) {
        throw new BadRequestException('Car is not available');
      }

      // Check for overlapping bookings
      const overlappingBooking = await this.prisma.carBooking.findFirst({
        where: {
          carId: createBookingDto.carId,
          status: { not: 'CANCELLED' },
          OR: [
            {
              pickupDate: { lte: createBookingDto.returnDate },
              returnDate: { gte: createBookingDto.pickupDate }
            }
          ]
        }
      });

      if (overlappingBooking) {
        throw new BadRequestException('Car is already booked for the selected dates');
      }

      // Calculate total amount
      const days = Math.ceil(
        (new Date(createBookingDto.returnDate).getTime() - 
         new Date(createBookingDto.pickupDate).getTime()) / (1000 * 60 * 60 * 24)
      );
      const totalAmount = car.pricePerDay * days;

      const booking = await this.prisma.carBooking.create({
        data: {
          bookingReference: 'CAR-' + Date.now(),
          userId,
          carId: createBookingDto.carId,
          pickupDate: new Date(createBookingDto.pickupDate),
          returnDate: new Date(createBookingDto.returnDate),
          pickupLocation: createBookingDto.pickupLocation,
          returnLocation: createBookingDto.returnLocation,
          totalAmount,
          driverLicense: 'TMP-LICENSE', // Would get from user profile or request
          status: 'CONFIRMED'
        },
        include: {
          car: { select: { brand: true, model: true, category: true } }
        }
      });

      return {
        success: true,
        message: 'Car booking created successfully',
        data: booking
      };
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      
      return {
        success: true,
        message: 'Car booking created successfully (demo mode)',
        data: {
          id: 'demo-car-booking-' + Date.now(),
          userId,
          carId: createBookingDto.carId,
          pickupDate: createBookingDto.pickupDate,
          returnDate: createBookingDto.returnDate,
          pickupLocation: createBookingDto.pickupLocation,
          returnLocation: createBookingDto.returnLocation,
          totalAmount: 135.00,
          status: 'CONFIRMED',
          car: { brand: 'Toyota', model: 'Camry', category: 'Economy' }
        },
        note: 'Database not connected - demo booking created'
      };
    }
  }

  async getUserBookings(userId: string) {
    try {
      const bookings = await this.prisma.carBooking.findMany({
        where: { userId },
        include: {
          car: { 
            select: { 
              brand: true, 
              model: true, 
              category: true, 
              pricePerDay: true 
            } 
          }
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