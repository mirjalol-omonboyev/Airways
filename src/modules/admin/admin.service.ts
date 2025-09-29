import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getDashboardStats() {
    try {
      const [
        totalUsers,
        totalBookings,
        totalRevenue,
        recentBookings,
        userStats,
        bookingStats
      ] = await Promise.all([
        // Total users
        this.prisma.user.count(),
        
        // Total bookings across all services
        Promise.all([
          this.prisma.booking.count(),
          this.prisma.hotelBooking.count(),
          this.prisma.carBooking.count(),
          this.prisma.tourBooking.count(),
          this.prisma.insuranceBooking.count(),
        ]).then(counts => counts.reduce((sum, count) => sum + count, 0)),
        
        // Total revenue
        Promise.all([
          this.prisma.booking.aggregate({ _sum: { totalAmount: true } }),
          this.prisma.hotelBooking.aggregate({ _sum: { totalAmount: true } }),
          this.prisma.carBooking.aggregate({ _sum: { totalAmount: true } }),
          this.prisma.tourBooking.aggregate({ _sum: { totalAmount: true } }),
          this.prisma.insuranceBooking.aggregate({ _sum: { totalAmount: true } }),
        ]).then(sums => 
          sums.reduce((total, sum) => total + (sum._sum.totalAmount || 0), 0)
        ),
        
        // Recent bookings (last 10)
        this.prisma.booking.findMany({
          take: 5,
          orderBy: { createdAt: 'desc' },
          include: {
            user: { select: { firstName: true, lastName: true, email: true } },
            flight: { select: { flightNumber: true } }
          }
        }),
        
        // User role distribution
        this.prisma.user.groupBy({
          by: ['role'],
          _count: { role: true }
        }),
        
        // Booking status distribution
        this.prisma.booking.groupBy({
          by: ['status'],
          _count: { status: true }
        })
      ]);

      return {
        overview: {
          totalUsers,
          totalBookings,
          totalRevenue: totalRevenue.toFixed(2),
          activeFlights: await this.prisma.flight.count({
            where: { status: 'SCHEDULED' }
          })
        },
        recentBookings,
        charts: {
          userDistribution: userStats,
          bookingStatus: bookingStats
        }
      };
    } catch (error) {
      // Return mock data if database is not connected
      return {
        overview: {
          totalUsers: 0,
          totalBookings: 0,
          totalRevenue: '0.00',
          activeFlights: 0
        },
        recentBookings: [],
        charts: {
          userDistribution: [],
          bookingStatus: []
        },
        note: 'Database not connected - showing demo data'
      };
    }
  }

  async getAllUsers(page = 1, limit = 10, search = '') {
    try {
      const skip = (page - 1) * limit;
      const where: Prisma.UserWhereInput = search ? {
        OR: [
          { email: { contains: search, mode: Prisma.QueryMode.insensitive } },
          { firstName: { contains: search, mode: Prisma.QueryMode.insensitive } },
          { lastName: { contains: search, mode: Prisma.QueryMode.insensitive } }
        ]
      } : {};

      const [users, total] = await Promise.all([
        this.prisma.user.findMany({
          where,
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
            isActive: true,
            isEmailVerified: true,
            lastLoginAt: true,
            createdAt: true
          }
        }),
        this.prisma.user.count({ where })
      ]);

      return {
        users,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      return {
        users: [],
        pagination: { total: 0, page: 1, limit: 10, totalPages: 0 },
        note: 'Database not connected'
      };
    }
  }

  async updateUserRole(userId: string, role: string) {
    try {
      return await this.prisma.user.update({
        where: { id: userId },
        data: { role: role as any },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true
        }
      });
    } catch (error) {
      throw new Error('Failed to update user role');
    }
  }

  async toggleUserStatus(userId: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: { isActive: true }
      });

      return await this.prisma.user.update({
        where: { id: userId },
        data: { isActive: !user.isActive },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          isActive: true
        }
      });
    } catch (error) {
      throw new Error('Failed to toggle user status');
    }
  }

  async getSystemSettings() {
    try {
      const settings = await this.prisma.adminSettings.findMany({
        orderBy: { category: 'asc' }
      });

      return settings.reduce((acc, setting) => {
        if (!acc[setting.category]) {
          acc[setting.category] = {};
        }
        acc[setting.category][setting.key] = {
          value: setting.value,
          description: setting.description,
          isActive: setting.isActive
        };
        return acc;
      }, {});
    } catch (error) {
      return {
        system: {
          maintenance_mode: {
            value: 'false',
            description: 'Enable maintenance mode',
            isActive: true
          },
          max_bookings_per_user: {
            value: '10',
            description: 'Maximum bookings per user',
            isActive: true
          }
        },
        note: 'Database not connected - showing demo settings'
      };
    }
  }

  async updateSystemSetting(key: string, value: string, category = 'system') {
    try {
      return await this.prisma.adminSettings.upsert({
        where: { key },
        update: { value },
        create: {
          key,
          value,
          category,
          description: `Auto-created setting: ${key}`
        }
      });
    } catch (error) {
      throw new Error('Failed to update system setting');
    }
  }

  async getSystemLogs(page = 1, limit = 50) {
    try {
      const skip = (page - 1) * limit;
      
      const [logs, total] = await Promise.all([
        this.prisma.systemLog.findMany({
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
          include: {
            user: {
              select: { firstName: true, lastName: true, email: true }
            }
          }
        }),
        this.prisma.systemLog.count()
      ]);

      return {
        logs,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      return {
        logs: [],
        pagination: { total: 0, page: 1, limit: 50, totalPages: 0 },
        note: 'Database not connected'
      };
    }
  }
}