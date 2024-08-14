import { IsNotEmpty } from 'class-validator';

export class AuthPayloadDto {
  @IsNotEmpty()
  username: string;
  @IsNotEmpty()
  password: string;
}
