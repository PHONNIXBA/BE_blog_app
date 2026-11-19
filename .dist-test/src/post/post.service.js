var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service.js';
let PostService = class PostService {
    databaseService;
    constructor(databaseService) {
        this.databaseService = databaseService;
    }
    async getAllPost() {
        const posts = await this.databaseService.getAllPosts();
        const comments = await this.databaseService.getAllComment();
        for (const post of posts) {
            const postComment = comments.filter(comment => comment.post_id === post.id);
            post.comment = postComment;
        }
        return posts;
    }
    async getDetailPost(id) {
        const post = await this.databaseService.getDetailPost(id);
        post.comment = await this.databaseService.getDetailPostComments(id);
        return post;
    }
    async createPost(dto) {
        const newPost = await this.databaseService.createPost(dto);
        newPost.comment = [];
        return newPost;
    }
    async likePost(id) {
        await this.databaseService.likePost(id);
        return this.getDetailPost(id);
    }
    async addComment(id, dto) {
        await this.databaseService.addComment(id, dto);
        return this.getDetailPost(id);
    }
};
PostService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [DatabaseService])
], PostService);
export { PostService };
//# sourceMappingURL=post.service.js.map