var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Pool } from "pg";
let DatabaseService = class DatabaseService {
    configService;
    pool;
    constructor(configService) {
        this.configService = configService;
        const database = this.configService.getOrThrow('DB_NAME');
        if (process.env.NODE_ENV === 'test' && database !== 'test') {
            throw new Error('Unsafe database configuration for testing');
        }
        this.pool = new Pool({
            host: this.configService.getOrThrow('DB_HOST'),
            port: Number(this.configService.getOrThrow('DB_PORT')),
            database,
            user: this.configService.getOrThrow('DB_USER'),
            password: this.configService.getOrThrow('DB_PASSWORD')
        });
        this.pool.on('error', (error) => {
            console.error('PostgreSQL connection error:', error);
        });
    }
    async onModuleInit() {
        const result = await this.pool.query('SELECT current_database()');
        console.log('Connected to PostgreSQL:', result.rows[0].current_database);
    }
    async onModuleDestroy() {
        await this.pool.end();
    }
    async getAllPosts() {
        const result = await this.pool.query('SELECT * FROM posts');
        return result.rows;
    }
    async getAllComment() {
        const result = await this.pool.query('SELECT * FROM comments');
        return result.rows;
    }
    async getDetailPost(id) {
        const result = await this.pool.query('SELECT * FROM posts WHERE id = $1', [id]);
        return result.rows[0];
    }
    async getDetailPostComments(id) {
        const result = await this.pool.query('SELECT * FROM comments WHERE post_id = $1', [id]);
        return result.rows;
    }
    async createPost(dto) {
        const result = await this.pool.query(`INSERT INTO posts (author, title, description)
            VALUES ($1, $2, $3)
            RETURNING *`, [dto.author, dto.title, dto.description]);
        return result.rows[0];
    }
    async likePost(id) {
        const result = await this.pool.query(`UPDATE posts
            SET 
                "like" = CASE
                    WHEN liked = false THEN "like" +1
                    ELSE "like" - 1
                END,
                liked = NOT liked
            WHERE id = $1
            RETURNING *`, [id]);
        return result.rows[0];
    }
    async addComment(postId, dto) {
        const result = await this.pool.query(`INSERT INTO comments (post_id, author, content)
            VALUES ($1, $2, $3)
            RETURNING *`, [postId, "You", dto.content]);
        return result.rows[0];
    }
    async findUserByAccountName(accountName) {
        const result = await this.pool.query(`SELECT id, account_name, password_hash, display_name, created_at
            FROM users
            WHERE account_name = $1`, [accountName]);
        return result.rows[0] ?? null;
    }
    async createUser(accountName, passwordHash, displayName) {
        const result = await this.pool.query(`INSERT INTO users(
                account_name,
                password_hash,
                display_name
            )
            VALUES ($1, $2, $3)
            RETURNING id, account_name, display_name`, [accountName, passwordHash, displayName]);
        return result.rows[0];
    }
    async getDatabaseName() {
        const result = await this.pool.query("SELECT current_database()");
        return result.rows[0].current_database;
    }
};
DatabaseService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [ConfigService])
], DatabaseService);
export { DatabaseService };
//# sourceMappingURL=database.service.js.map