import { IsNotEmpty, IsNumber, IsOptional, IsString, Matches } from "class-validator";

export class MoveTaskDto {
    @IsNotEmpty()
    @IsString()
    @Matches(/^[0-9a-fA-F]{24}$/, { message: 'Invalid task ID format' })
    taskId!: string;

    @IsNotEmpty()
    @IsString()
    @Matches(/^[0-9a-fA-F]{24}$/, { message: 'Invalid card ID format' })
    toCardId!: string;
}
