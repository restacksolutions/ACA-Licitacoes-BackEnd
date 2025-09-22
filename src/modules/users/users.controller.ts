import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../../core/security/jwt-auth.guard';
import { CurrentUser } from '../../core/security/current-user.decorator';

@ApiTags('Users')
@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('bearer')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current user with memberships' })
  @ApiResponse({ status: 200, description: 'User information retrieved successfully' })
  async me(@CurrentUser() user: any) {
    const userData = await this.usersService.findById(user.userId);
    const memberships = await this.usersService.findMemberships(user.userId);
    
    return {
      ...userData,
      memberships,
    };
  }
}
