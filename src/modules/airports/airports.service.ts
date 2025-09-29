import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AirportsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return { message: 'Airports service placeholder' };
  }
}