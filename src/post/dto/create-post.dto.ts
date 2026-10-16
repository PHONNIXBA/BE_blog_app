import {IsArray, IsBoolean, IsNumber, IsString} from "class-validator"

export class CreatePostDto {
    @IsString()
    author: string;
    @IsString()
    title: string;
    @IsString()
    descirption: string;
}

export class AddCommentDto {
    @IsString()
    author: string; 
    @IsString()
    content: string;
}