import { IsNotEmpty } from 'class-validator';

export class CreateSchoolDto {
  @IsNotEmpty()
  name: string;
  address: string;
  @IsNotEmpty()
  image: string;
  phoneNumber: string;
  info: string;
}
