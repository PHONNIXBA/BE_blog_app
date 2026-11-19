import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service.js";
import { CreateUserDto } from "./dto/register.dto.js";

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService){}

    @Post('register')
    createUser(@Body() dto: CreateUserDto) {
        return this.authService.register(dto);
    }
}