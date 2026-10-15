import { IsUsername } from './username.decorator';

export class UpdateProfileDto {
  @IsUsername()
  username!: string;
}
