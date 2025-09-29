import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';

export class UpdateUserRoleDto {
  @ApiProperty({
    description: 'New role for the user',
    enum: UserRole,
    example: UserRole.ADMIN
  })
  @IsEnum(UserRole, { message: 'Role must be a valid UserRole' })
  @IsNotEmpty({ message: 'Role is required' })
  role: UserRole;
}

export class UpdateSystemSettingDto {
  @ApiProperty({
    description: 'Setting value',
    example: 'true'
  })
  @IsString({ message: 'Value must be a string' })
  @IsNotEmpty({ message: 'Value is required' })
  value: string;

  @ApiProperty({
    description: 'Setting category',
    example: 'system',
    required: false
  })
  @IsString({ message: 'Category must be a string' })
  @IsOptional()
  category?: string;
}

export class UserSearchQueryDto {
  @ApiProperty({
    description: 'Page number for pagination',
    example: 1,
    required: false,
    default: 1
  })
  @IsOptional()
  page?: number;

  @ApiProperty({
    description: 'Number of items per page',
    example: 10,
    required: false,
    default: 10
  })
  @IsOptional()
  limit?: number;

  @ApiProperty({
    description: 'Search term for filtering users',
    example: 'john',
    required: false
  })
  @IsOptional()
  @IsString({ message: 'Search term must be a string' })
  search?: string;
}

export class LogsQueryDto {
  @ApiProperty({
    description: 'Page number for pagination',
    example: 1,
    required: false,
    default: 1
  })
  @IsOptional()
  page?: number;

  @ApiProperty({
    description: 'Number of items per page',
    example: 50,
    required: false,
    default: 50
  })
  @IsOptional()
  limit?: number;
}