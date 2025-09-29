import { PrismaClient, UserRole, SeatClass } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@airways.com' },
    update: {},
    create: {
      email: 'admin@airways.com',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: UserRole.ADMIN,
      isEmailVerified: true,
      emailVerifiedAt: new Date(),
    },
  });

  // Create sample airlines
  const americanAirlines = await prisma.airline.upsert({
    where: { code: 'AA' },
    update: {},
    create: {
      name: 'American Airlines',
      code: 'AA',
      country: 'United States',
      website: 'https://www.aa.com',
    },
  });

  const deltaAirlines = await prisma.airline.upsert({
    where: { code: 'DL' },
    update: {},
    create: {
      name: 'Delta Air Lines',
      code: 'DL',
      country: 'United States',
      website: 'https://www.delta.com',
    },
  });

  // Create sample airports
  const jfkAirport = await prisma.airport.upsert({
    where: { code: 'JFK' },
    update: {},
    create: {
      name: 'John F. Kennedy International Airport',
      code: 'JFK',
      city: 'New York',
      country: 'United States',
      timezone: 'America/New_York',
      latitude: 40.6413,
      longitude: -73.7781,
    },
  });

  const laxAirport = await prisma.airport.upsert({
    where: { code: 'LAX' },
    update: {},
    create: {
      name: 'Los Angeles International Airport',
      code: 'LAX',
      city: 'Los Angeles',
      country: 'United States',
      timezone: 'America/Los_Angeles',
      latitude: 33.9425,
      longitude: -118.4081,
    },
  });

  const lhrAirport = await prisma.airport.upsert({
    where: { code: 'LHR' },
    update: {},
    create: {
      name: 'London Heathrow Airport',
      code: 'LHR',
      city: 'London',
      country: 'United Kingdom',
      timezone: 'Europe/London',
      latitude: 51.4700,
      longitude: -0.4543,
    },
  });

  // Create sample aircraft
  const boeing737 = await prisma.aircraft.upsert({
    where: { registrationNumber: 'N737AA' },
    update: {},
    create: {
      model: 'Boeing 737-800',
      manufacturer: 'Boeing',
      totalSeats: 160,
      economySeats: 144,
      businessSeats: 16,
      firstClassSeats: 0,
      yearManufactured: 2018,
      registrationNumber: 'N737AA',
    },
  });

  const airbusA320 = await prisma.aircraft.upsert({
    where: { registrationNumber: 'N320DL' },
    update: {},
    create: {
      model: 'Airbus A320',
      manufacturer: 'Airbus',
      totalSeats: 150,
      economySeats: 132,
      businessSeats: 18,
      firstClassSeats: 0,
      yearManufactured: 2019,
      registrationNumber: 'N320DL',
    },
  });

  // Create sample flights
  const flight1 = await prisma.flight.upsert({
    where: { flightNumber: 'AA100' },
    update: {},
    create: {
      flightNumber: 'AA100',
      airlineId: americanAirlines.id,
      aircraftId: boeing737.id,
      departureAirportId: jfkAirport.id,
      arrivalAirportId: laxAirport.id,
      departureTime: new Date('2025-12-01T08:00:00Z'),
      arrivalTime: new Date('2025-12-01T11:30:00Z'),
      duration: 330, // 5.5 hours
      economyPrice: 299.99,
      businessPrice: 799.99,
      firstClassPrice: 1299.99,
      availableSeats: {
        economy: 144,
        business: 16,
        firstClass: 0,
      },
    },
  });

  const flight2 = await prisma.flight.upsert({
    where: { flightNumber: 'DL200' },
    update: {},
    create: {
      flightNumber: 'DL200',
      airlineId: deltaAirlines.id,
      aircraftId: airbusA320.id,
      departureAirportId: laxAirport.id,
      arrivalAirportId: lhrAirport.id,
      departureTime: new Date('2025-12-01T14:00:00Z'),
      arrivalTime: new Date('2025-12-02T08:00:00Z'),
      duration: 660, // 11 hours
      economyPrice: 599.99,
      businessPrice: 1599.99,
      firstClassPrice: 2899.99,
      availableSeats: {
        economy: 132,
        business: 18,
        firstClass: 0,
      },
    },
  });

  console.log('✅ Database seeded successfully!');
  console.log('👤 Admin user created:', adminUser.email);
  console.log('✈️ Airlines created:', americanAirlines.name, deltaAirlines.name);
  console.log('🛫 Airports created:', jfkAirport.name, laxAirport.name, lhrAirport.name);
  console.log('🛩️ Aircraft created:', boeing737.model, airbusA320.model);
  console.log('🎫 Flights created:', flight1.flightNumber, flight2.flightNumber);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Error seeding database:', e);
    await prisma.$disconnect();
    process.exit(1);
  });