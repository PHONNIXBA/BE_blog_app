import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Pool } from "pg";
import { AddCommentDto, CreatePostDto } from "../post/dto/create-post.dto.js";

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
    private pool: Pool;
    
    constructor(private readonly configService: ConfigService) {
        this.pool = new Pool({
            host: this.configService.getOrThrow<string>('DB_HOST'),
            port: Number(this.configService.getOrThrow<string>('DB_PORT')),
            database: this.configService.getOrThrow<string>('DB_NAME'),
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
}