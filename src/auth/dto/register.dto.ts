import { IsString, Length, Matches } from "class-validator";

export class CreateUserDto {
    @IsString()
    @Matches(/^[a-zA-Z0-9_]{3,50}$/)
    accountName: string

    @IsString()
    @Length(8, 128)
    password: string;

    @IsString()
    @Length(1, 100)
    displayName: string;
}
