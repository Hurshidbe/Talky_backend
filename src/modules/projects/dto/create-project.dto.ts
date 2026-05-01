import { IsArray, IsNotEmpty, IsOptional, IsString, Length } from "class-validator";

export class CreateProjectDto {
    @IsNotEmpty()
    @IsString()
    @Length(1,500)
    name! : string

    @IsOptional()
    @IsString()
    @Length(0,5000)
    description? :string

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    collobrators?: string[];
}
