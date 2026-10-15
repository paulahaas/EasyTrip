import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length } from 'class-validator';
import { IsUsername } from './username.decorator';

export class RegisterDto {
  @ApiProperty({
    description: 'Email do usuário (único).',
    example: 'maria@easytrip.com',
  })
  @IsEmail()
  email!: string;

  @IsUsername()
  username!: string;

  @ApiProperty({
    description: 'Senha com 6 a 72 caracteres.',
    minLength: 6,
    maxLength: 72,
    example: 'secret123',
  })
  @IsString()
  @Length(6, 72)
  password!: string;
}
