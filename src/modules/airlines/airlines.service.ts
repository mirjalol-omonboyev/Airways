import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AirlinesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return { message: 'Airlines service placeholder' };
  }
}