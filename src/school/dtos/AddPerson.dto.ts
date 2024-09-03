import { IsNotEmpty } from 'class-validator';

export class AddPersonDto {
  @IsNotEmpty()
  schoolId: number;
  @IsNotEmpty()
  userId: number;
}
