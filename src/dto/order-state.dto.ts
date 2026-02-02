import { IsString } from "class-validator";

export class OrderStateDto {
  @IsString()
  name: string;

  @IsString()
  color: string;
}
