import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'Email cadastrado.',
    example: 'maria@easytrip.com',
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    description: 'Senha (mín 6 caracteres).',
    minLength: 6,
    example: 'secret123',
  })
  @IsString()
  @MinLength(6)
  password!: string;
}
