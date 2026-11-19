import { ConflictException, Injectable } from "@nestjs/common";
import { UsersService } from "../users/users.service.js";
import { CreateUserDto } from "./dto/register.dto.js";
import * as argon2 from "argon2";
import { DatabaseError } from "pg";

@Injectable()
export class AuthService {
    constructor(private readonly usersService: UsersService){}
    
    async register(dto: CreateUserDto) {
        const passwordHash = await argon2.hash(dto.password);
        try {
            return await this.usersService.createUser(
                dto.accountName.toLowerCase(),
                passwordHash,
                dto.displayName
            );
        } catch (error) {
            if (error instanceof DatabaseError && error.code === '23505' && error.constraint === 'users_account_name_key') {
                throw new ConflictException("Account name already exists");
            }
            throw error;
        }
    }
}