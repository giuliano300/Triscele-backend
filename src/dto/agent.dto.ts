import { IsOptional, IsString } from "class-validator";

export class AgentDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  email: string;
}
