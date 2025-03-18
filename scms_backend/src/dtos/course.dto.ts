import { IsString, IsNumber, IsOptional, IsBoolean, IsArray, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

export class ModuleDto {
  @IsString()
  name!: string;

  @IsString()
  code!: string;

  @IsString()
  semester!: string;

  @IsNumber()
  @IsOptional()
  credits?: number;

  @IsBoolean()
  isMandatory!: boolean;

  @IsString()
  @IsOptional()
  lecturerId?: string;
}

export class CreateCourseDto {
  @IsString()
  code!: string;

  @IsString()
  name!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  credits!: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ModuleDto)
  @IsOptional()
  modules?: ModuleDto[];
}

export class UpdateCourseDto {
  @IsString()
  @IsOptional()
  code?: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsOptional()
  credits?: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ModuleDto)
  @IsOptional()
  modules?: ModuleDto[];
} 