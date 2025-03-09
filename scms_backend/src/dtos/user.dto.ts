import { IsEmail, IsString, MinLength, IsOptional, IsArray } from "class-validator";

export class CreateUserDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(6)
  password!: string;

  @IsString()
  firstName!: string;

  @IsString()
  lastName!: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsString()
  roleName!: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  directPermissionNames?: string[];
}

export class UpdateUserDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsOptional()
  @IsString()
  roleName?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  directPermissionNames?: string[];
}