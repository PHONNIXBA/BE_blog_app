import { Injectable } from "@nestjs/common";
import { DatabaseService } from "../database/database.service.js";

@Injectable()
export class UsersService {
    constructor(private readonly databaseService: DatabaseService){}
    
    async findByAccountName(accountName: string) {
        return this.databaseService.findUserByAccountName(accountName);
    }

    async createUser(accountName: string, passwordHash: string, displayName: string) {
        return this.databaseService.createUser(accountName, passwordHash, displayName);
    }
}