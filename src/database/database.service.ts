import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Pool } from "pg";
import { AddCommentDto, CreatePostDto } from "../post/dto/create-post.dto.js";

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
    private pool: Pool;
    constructor(private readonly configService: ConfigService) {
        const database = this.configService.getOrThrow<string>('DB_NAME');
        if (process.env.NODE_ENV === 'test' && database !== 'test') {
            throw new Error('Unsafe database configuration for testing');
        }
        this.pool = new Pool({
            host: this.configService.getOrThrow<string>('DB_HOST'),
            port: Number(this.configService.getOrThrow<string>('DB_PORT')),
            database,
            user: this.configService.getOrThrow<string>('DB_USER'),
            password: this.configService.getOrThrow<string>('DB_PASSWORD')
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

    async getDetailPost(id: string) {
        const result = await this.pool.query('SELECT * FROM posts WHERE id = $1', [id]);
        return result.rows[0];
    }

    async getDetailPostComments(id: string) {
        const result = await this.pool.query('SELECT * FROM comments WHERE post_id = $1', [id]);
        return result.rows;
    }

    async createPost(dto: CreatePostDto) {
        const result = await this.pool.query(
            `INSERT INTO posts (author, title, description)
            VALUES ($1, $2, $3)
            RETURNING *`,
            [dto.author, dto.title, dto.description]
        );
        return result.rows[0];
    }

    async likePost(id: string) {
        const result = await this.pool.query(
            `UPDATE posts
            SET 
                "like" = CASE
                    WHEN liked = false THEN "like" +1
                    ELSE "like" - 1
                END,
                liked = NOT liked
            WHERE id = $1
            RETURNING *`,
            [id]
        );
        return result.rows[0];
    }
    
    async addComment(postId: string, dto: AddCommentDto) {
        const result = await this.pool.query(
            `INSERT INTO comments (post_id, author, content)
            VALUES ($1, $2, $3)
            RETURNING *`,
            [postId, "You", dto.content]
        );
        return result.rows[0];
    }

    async findUserByAccountName(accountName: string) {
        const result = await this.pool.query(
            `SELECT id, account_name, password_hash, display_name, created_at
            FROM users
            WHERE account_name = $1`,
            [accountName]
        );
        return result.rows[0] ?? null;
    }async createUser(accountName: string, passwordHash: string, displayName: string) {
        const result = await this.pool.query(
            `INSERT INTO users(
                account_name,
                password_hash,
                display_name
            )
            VALUES ($1, $2, $3)
            RETURNING id, account_name, display_name`,
            [accountName, passwordHash, displayName]
        );
        return result.rows[0];
    }
    async getDatabaseName(): Promise<string> {
        const result = await this.pool.query(
            "SELECT current_database()"
        );
        return result.rows[0].current_database;
    }
}