import { Controller, Post, Body, Get, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';
import { AuthResponseDto, UserResponseDto } from './dto/auth-response.dto';
import { JwtAuthGuard } from '../../core/security/jwt-auth.guard';
import { CurrentUser } from '../../core/security/current-user.decorator';
import { Public } from '../../core/security/public.decorator';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @Public()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ 
    summary: 'Register a new user and company',
    description: 'Creates a new user account with an associated company. The user becomes the owner of the company.'
  })
  @ApiResponse({ 
    status: 201, 
    description: 'User and company created successfully', 
    type: AuthResponseDto 
  })
  @ApiResponse({ status: 409, description: 'Email already exists' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  async register(@Body() registerDto: RegisterDto): Promise<AuthResponseDto> {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Login with email and password',
    description: 'Authenticates a user and returns JWT tokens for API access'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Login successful', 
    type: AuthResponseDto 
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() loginDto: LoginDto): Promise<AuthResponseDto> {
    return this.authService.login(loginDto);
  }

  @Post('refresh')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Refresh access token',
    description: 'Generates new access and refresh tokens using a valid refresh token'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Token refreshed successfully', 
    type: AuthResponseDto 
  })
  @ApiResponse({ status: 401, description: 'Invalid refresh token' })
  async refresh(@Body() refreshDto: RefreshDto): Promise<AuthResponseDto> {
    return this.authService.refresh(refreshDto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('bearer')
  @ApiOperation({ 
    summary: 'Get current user information',
    description: 'Returns the authenticated user\'s basic information'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'User information retrieved successfully', 
    type: UserResponseDto 
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async me(@CurrentUser() user: any): Promise<UserResponseDto> {
    return this.authService.me(user.userId);
  }
}
