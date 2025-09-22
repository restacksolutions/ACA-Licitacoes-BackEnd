import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'joao@example.com' })
  @IsEmail({}, { message: 'Email must be a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email!: string;

  @ApiProperty({ example: 'Senha123' })
  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  password!: string;
}
