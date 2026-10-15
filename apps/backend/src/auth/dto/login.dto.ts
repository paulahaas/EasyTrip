import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'Email ou nome de usuário cadastrado.',
    example: 'maria.silva',
  })
  @IsString()
  @IsNotEmpty()
  login!: string;

  @ApiProperty({
    description: 'Senha (mín 6 caracteres).',
    minLength: 6,
    example: 'secret123',
  })
  @IsString()
  @MinLength(6)
  password!: string;
}
