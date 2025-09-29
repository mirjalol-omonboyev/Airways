import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Dashboard')
@Controller('dashboard')
export class DashboardController {
  
  @Get()
  @ApiOperation({ summary: 'Get public dashboard info' })
  @ApiResponse({ status: 200, description: 'Public dashboard info retrieved successfully' })
  async getPublicDashboard() {
    return {
      success: true,
      message: 'Welcome to Airways Comprehensive Booking Platform',
      data: {
        platform: 'Airways Travel & Booking System',
        version: '2.0.0',
        services: [
          {
            name: 'Flight Booking',
            endpoint: '/api/flights',
            description: 'Search and book domestic and international flights',
            features: ['Real-time availability', 'Multiple class options', 'Flexible booking']
          },
          {
            name: 'Hotel Booking',
            endpoint: '/api/hotels',
            description: 'Find and reserve hotels worldwide',
            features: ['Room selection', 'Instant confirmation', 'Special requests']
          },
          {
            name: 'Car Rental',
            endpoint: '/api/cars',
            description: 'Rent vehicles for your travel needs',
            features: ['Various categories', 'Flexible pickup/return', 'Multiple locations']
          },
          {
            name: 'Tour Packages',
            endpoint: '/api/tours',
            description: 'Explore curated travel packages',
            features: ['Group bookings', 'All-inclusive options', 'Local guides']
          },
          {
            name: 'Travel Insurance',
            endpoint: '/api/insurance',
            description: 'Protect your travel investment',
            features: ['Medical coverage', 'Trip cancellation', 'Baggage protection']
          }
        ],
        authentication: {
          required: false,
          endpoint: '/api/auth/login',
          signupEndpoint: '/api/auth/register'
        },
        documentation: {
          swagger: '/api/docs',
          description: 'Interactive API documentation'
        }
      }
    };
  }

  @Get('user')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get personalized user dashboard' })
  @ApiResponse({ status: 200, description: 'User dashboard retrieved successfully' })
  async getUserDashboard() {
    return {
      success: true,
      message: 'Welcome to your personalized dashboard',
      data: {
        quickActions: [
          {
            title: 'Book a Flight',
            description: 'Search flights and make reservations',
            endpoint: '/api/flights',
            icon: '✈️'
          },
          {
            title: 'Find Hotels',
            description: 'Discover accommodations for your trip',
            endpoint: '/api/hotels',
            icon: '🏨'
          },
          {
            title: 'Rent a Car',
            description: 'Get a vehicle for your journey',
            endpoint: '/api/cars',
            icon: '🚗'
          },
          {
            title: 'Explore Tours',
            description: 'Browse exciting tour packages',
            endpoint: '/api/tours',
            icon: '🗺️'
          },
          {
            title: 'Get Insurance',
            description: 'Protect your travel plans',
            endpoint: '/api/insurance',
            icon: '🛡️'
          }
        ],
        myBookings: {
          flights: '/api/bookings/my',
          hotels: '/api/hotels/bookings/my',
          cars: '/api/cars/bookings/my',
          tours: '/api/tours/bookings/my',
          insurance: '/api/insurance/policies/my'
        },
        account: {
          profile: '/api/users/profile',
          settings: '/api/users/settings',
          support: '/api/support'
        }
      }
    };
  }

  @Get('admin')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin dashboard access point' })
  @ApiResponse({ status: 200, description: 'Admin dashboard info' })
  async getAdminAccess() {
    return {
      success: true,
      message: 'Admin Panel Access',
      data: {
        notice: 'Admin authentication required',
        adminPanel: '/api/admin',
        endpoints: {
          dashboard: '/api/admin/dashboard',
          users: '/api/admin/users',
          settings: '/api/admin/settings',
          logs: '/api/admin/logs',
          health: '/api/admin/health'
        },
        requiredRole: 'ADMIN or SUPER_ADMIN',
        authentication: 'JWT Bearer token with admin privileges required'
      }
    };
  }
}