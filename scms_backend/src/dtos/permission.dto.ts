import { IsString, IsOptional } from "class-validator";

export class CreatePermissionDto {
  @IsString()
  name!: string;

  @IsString()
  category!: string;

  @IsString()
  @IsOptional()
  scope?: string;

  @IsString()
  description!: string;
}

export class UpdatePermissionDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  category!: string;

  @IsString()
  @IsOptional()
  scope?: string;

  @IsString()
  description!: string;
}