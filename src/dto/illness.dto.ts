import { Type } from "class-transformer";
import { IsBoolean, IsDate, IsString } from "class-validator";

export class IllnessDto {
  @IsString()
  operatorId: string;
  
  @IsString()
  protocol: string;
  
  @IsBoolean()
  read?: boolean;
  
 @IsDate()
  @Type(() => Date)
  start?: Date;

  @IsDate()
  @Type(() => Date)
  end?: Date;  
}
