import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SearchFlightsDto } from './dto/search-flights.dto';

@Injectable()
export class FlightsService {
  constructor(private prisma: PrismaService) {}

  async searchFlights(searchDto: SearchFlightsDto) {
    const { departureAirport, arrivalAirport, departureDate, passengers } = searchDto;

    // Parse departure date
    const searchDate = new Date(departureDate);
    const startOfDay = new Date(searchDate.getFullYear(), searchDate.getMonth(), searchDate.getDate());
    const endOfDay = new Date(searchDate.getFullYear(), searchDate.getMonth(), searchDate.getDate() + 1);

    const flights = await this.prisma.flight.findMany({
      where: {
        departureAirport: {
          code: departureAirport.toUpperCase(),
        },
        arrivalAirport: {
          code: arrivalAirport.toUpperCase(),
        },
        departureTime: {
          gte: startOfDay,
          lt: endOfDay,
        },
        status: 'SCHEDULED',
      },
      include: {
        airline: true,
        aircraft: true,
        departureAirport: true,
        arrivalAirport: true,
      },
      orderBy: {
        departureTime: 'asc',
      },
    });

    // Filter flights with available seats
    const availableFlights = flights.filter((flight) => {
      const availableSeats = flight.availableSeats as any;
      return (
        availableSeats.economy >= passengers ||
        availableSeats.business >= passengers ||
        availableSeats.firstClass >= passengers
      );
    });

    return availableFlights.map((flight) => ({
      id: flight.id,
      flightNumber: flight.flightNumber,
      airline: {
        name: flight.airline.name,
        code: flight.airline.code,
        logo: flight.airline.logo,
      },
      aircraft: {
        model: flight.aircraft.model,
        manufacturer: flight.aircraft.manufacturer,
      },
      departure: {
        airport: {
          code: flight.departureAirport.code,
          name: flight.departureAirport.name,
          city: flight.departureAirport.city,
        },
        time: flight.departureTime,
      },
      arrival: {
        airport: {
          code: flight.arrivalAirport.code,
          name: flight.arrivalAirport.name,
          city: flight.arrivalAirport.city,
        },
        time: flight.arrivalTime,
      },
      duration: flight.duration,
      prices: {
        economy: flight.economyPrice,
        business: flight.businessPrice,
        firstClass: flight.firstClassPrice,
      },
      availableSeats: flight.availableSeats,
      status: flight.status,
    }));
  }

  async findById(id: string) {
    const flight = await this.prisma.flight.findUnique({
      where: { id },
      include: {
        airline: true,
        aircraft: true,
        departureAirport: true,
        arrivalAirport: true,
      },
    });

    if (!flight) {
      return null;
    }

    return {
      id: flight.id,
      flightNumber: flight.flightNumber,
      airline: {
        name: flight.airline.name,
        code: flight.airline.code,
        logo: flight.airline.logo,
      },
      aircraft: {
        model: flight.aircraft.model,
        manufacturer: flight.aircraft.manufacturer,
        totalSeats: flight.aircraft.totalSeats,
        economySeats: flight.aircraft.economySeats,
        businessSeats: flight.aircraft.businessSeats,
        firstClassSeats: flight.aircraft.firstClassSeats,
      },
      departure: {
        airport: {
          code: flight.departureAirport.code,
          name: flight.departureAirport.name,
          city: flight.departureAirport.city,
          country: flight.departureAirport.country,
        },
        time: flight.departureTime,
      },
      arrival: {
        airport: {
          code: flight.arrivalAirport.code,
          name: flight.arrivalAirport.name,
          city: flight.arrivalAirport.city,
          country: flight.arrivalAirport.country,
        },
        time: flight.arrivalTime,
      },
      duration: flight.duration,
      prices: {
        economy: flight.economyPrice,
        business: flight.businessPrice,
        firstClass: flight.firstClassPrice,
      },
      availableSeats: flight.availableSeats,
      status: flight.status,
    };
  }

  async updateAvailableSeats(flightId: string, seatClass: string, seatsToBook: number) {
    const flight = await this.prisma.flight.findUnique({
      where: { id: flightId },
    });

    if (!flight) {
      throw new Error('Flight not found');
    }

    const availableSeats = flight.availableSeats as any;
    const seatClassKey = seatClass.toLowerCase();

    if (availableSeats[seatClassKey] < seatsToBook) {
      throw new Error('Not enough available seats');
    }

    // Update available seats
    availableSeats[seatClassKey] -= seatsToBook;

    return this.prisma.flight.update({
      where: { id: flightId },
      data: {
        availableSeats,
      },
    });
  }
}