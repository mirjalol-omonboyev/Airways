import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  @Get()
  @ApiOperation({ summary: 'Health check endpoint' })
  @ApiResponse({
    status: 200,
    description: 'Service is healthy',
    schema: {
      example: {
        status: 'ok',
        timestamp: '2025-09-29T12:00:00.000Z',
        uptime: 123.456,
        memory: {
          used: '45.2 MB',
          total: '128 MB',
        },
        version: '1.0.0',
      },
    },
  })
  check() {
    const memoryUsage = process.memoryUsage();
    
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: {
        used: `${Math.round(memoryUsage.heapUsed / 1024 / 1024 * 100) / 100} MB`,
        total: `${Math.round(memoryUsage.heapTotal / 1024 / 1024 * 100) / 100} MB`,
      },
      version: process.env.npm_package_version || '1.0.0',
    };
  }
}