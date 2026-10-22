import { Injectable, NotFoundException } from '@nestjs/common';
import { AddCommentDto, CreatePostDto } from './dto/create-post.dto.js';
import { DatabaseService } from '../database/database.service.js';

@Injectable()
export class PostService {
    constructor(private readonly databaseService: DatabaseService) {} 

    async getAllPost() {
        const posts = await this.databaseService.getAllPosts();
        const comments = await this.databaseService.getAllComment();
        for (const post of posts) {
            const postComment = comments.filter(comment => comment.post_id === post.id);
            post.comment = postComment;
        }
        
        return posts;
    }

    async getDetailPost(id: string) {
        const post = await this.databaseService.getDetailPost(id);
        post.comment = await this.databaseService.getDetailPostComments(id);
        
        return post;
    }

    async createPost(dto: CreatePostDto) {
        const newPost = await this.databaseService.createPost(dto);
        newPost.comment = [];
        return newPost;
    }

    async likePost(id: string) {
        await this.databaseService.likePost(id);
        return this.getDetailPost(id);
    }

    async addComment(id: string, dto: AddCommentDto) {
        await this.databaseService.addComment(id, dto);
        return this.getDetailPost(id);
    }
}
