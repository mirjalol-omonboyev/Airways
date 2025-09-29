import {
  Controller,
  Get,
  Put,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
  HttpStatus,
  HttpException,
  ParseIntPipe,
  DefaultValuePipe
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Admin')
@ApiBearerAuth()
@Controller('admin')
@UseGuards(JwtAuthGuard, AdminGuard)
@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Get admin dashboard statistics' })
  @ApiResponse({ status: 200, description: 'Dashboard statistics retrieved successfully' })
  async getDashboard() {
    try {
      const stats = await this.adminService.getDashboardStats();
      return {
        success: true,
        data: stats
      };
    } catch (error) {
      throw new HttpException(
        'Failed to fetch dashboard statistics',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('users')
  @ApiOperation({ summary: 'Get all users with pagination and search' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number (default: 1)' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page (default: 10)' })
  @ApiQuery({ name: 'search', required: false, type: String, description: 'Search term' })
  @ApiResponse({ status: 200, description: 'Users retrieved successfully' })
  async getAllUsers(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('search') search?: string
  ) {
    try {
      const result = await this.adminService.getAllUsers(page, limit, search || '');
      return {
        success: true,
        data: result
      };
    } catch (error) {
      throw new HttpException(
        'Failed to fetch users',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Put('users/:id/role')
  @ApiOperation({ summary: 'Update user role' })
  @ApiResponse({ status: 200, description: 'User role updated successfully' })
  @Roles(UserRole.SUPER_ADMIN) // Only super admin can change roles
  async updateUserRole(
    @Param('id') userId: string,
    @Body('role') role: string
  ) {
    try {
      // Validate role
      const validRoles = Object.values(UserRole);
      if (!validRoles.includes(role as UserRole)) {
        throw new HttpException(
          `Invalid role. Valid roles are: ${validRoles.join(', ')}`,
          HttpStatus.BAD_REQUEST
        );
      }

      const updatedUser = await this.adminService.updateUserRole(userId, role);
      return {
        success: true,
        message: 'User role updated successfully',
        data: updatedUser
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to update user role',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Patch('users/:id/toggle-status')
  @ApiOperation({ summary: 'Toggle user active status' })
  @ApiResponse({ status: 200, description: 'User status toggled successfully' })
  async toggleUserStatus(@Param('id') userId: string) {
    try {
      const updatedUser = await this.adminService.toggleUserStatus(userId);
      return {
        success: true,
        message: `User ${updatedUser.isActive ? 'activated' : 'deactivated'} successfully`,
        data: updatedUser
      };
    } catch (error) {
      throw new HttpException(
        'Failed to toggle user status',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('settings')
  @ApiOperation({ summary: 'Get system settings' })
  @ApiResponse({ status: 200, description: 'System settings retrieved successfully' })
  async getSystemSettings() {
    try {
      const settings = await this.adminService.getSystemSettings();
      return {
        success: true,
        data: settings
      };
    } catch (error) {
      throw new HttpException(
        'Failed to fetch system settings',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Put('settings/:key')
  @ApiOperation({ summary: 'Update system setting' })
  @ApiResponse({ status: 200, description: 'System setting updated successfully' })
  @Roles(UserRole.SUPER_ADMIN) // Only super admin can change system settings
  async updateSystemSetting(
    @Param('key') key: string,
    @Body('value') value: string,
    @Body('category') category?: string
  ) {
    try {
      const updatedSetting = await this.adminService.updateSystemSetting(
        key,
        value,
        category || 'system'
      );
      return {
        success: true,
        message: 'System setting updated successfully',
        data: updatedSetting
      };
    } catch (error) {
      throw new HttpException(
        'Failed to update system setting',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('logs')
  @ApiOperation({ summary: 'Get system logs with pagination' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number (default: 1)' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page (default: 50)' })
  @ApiResponse({ status: 200, description: 'System logs retrieved successfully' })
  async getSystemLogs(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(50), ParseIntPipe) limit: number
  ) {
    try {
      const result = await this.adminService.getSystemLogs(page, limit);
      return {
        success: true,
        data: result
      };
    } catch (error) {
      throw new HttpException(
        'Failed to fetch system logs',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('health')
  @ApiOperation({ summary: 'Admin health check' })
  @ApiResponse({ status: 200, description: 'Admin panel is healthy' })
  async adminHealth() {
    return {
      success: true,
      message: 'Admin panel is running',
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    };
  }
}