import { IsEmail, IsNotEmpty, IsString, Length } from "class-validator"

export class LoginDto {
    @IsNotEmpty()
    @Length(5,100)
    @IsEmail()
    email! : string

    @IsString()
    @Length(1,50)
    password! : string
}