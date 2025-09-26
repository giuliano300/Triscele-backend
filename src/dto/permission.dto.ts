import { IsMongoId, IsString } from "class-validator";

export class PermissionDto {
  @IsMongoId()
  _id: string;

  @IsString()
  name: string;
}
