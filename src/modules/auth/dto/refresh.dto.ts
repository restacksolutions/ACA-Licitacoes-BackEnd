import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class RefreshDto {
  @ApiProperty({ 
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'Refresh token to generate new access token'
  })
  @IsString()
  @IsNotEmpty({ message: 'Refresh token is required' })
  refresh_token!: string;
}
