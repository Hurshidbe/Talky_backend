import { IsNotEmpty, isNotEmpty, IsString, IsStrongPassword, MaxLength } from "class-validator"

export class SetPasswordDto {
    @IsNotEmpty()
    @MaxLength(50)
    @IsStrongPassword({
            minLength : 6,
            minNumbers : 1,
            minUppercase : 1,
        })
    password! : string

    @IsNotEmpty()
    @MaxLength(50)
    @IsStrongPassword({
            minLength : 6,
            minNumbers : 1,
            minUppercase : 1,
        })
    return_password! : string

}

export class ChangePasswordDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    old_password!: string
    
    @IsNotEmpty()
    @MaxLength(50)
    @IsStrongPassword({
            minLength : 6,
            minNumbers : 1,
            minUppercase : 1,
        })
    password! : string

    @IsNotEmpty()
    @MaxLength(50)
    @IsStrongPassword({
            minLength : 6,
            minNumbers : 1,
            minUppercase : 1,
        })
    return_password! : string

}