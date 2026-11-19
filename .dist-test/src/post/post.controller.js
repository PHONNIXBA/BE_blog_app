var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { PostService } from './post.service.js';
import { AddCommentDto, CreatePostDto } from './dto/create-post.dto.js';
let PostController = class PostController {
    postService;
    constructor(postService) {
        this.postService = postService;
    }
    getAllPost() {
        return this.postService.getAllPost();
    }
    getDetailPost(id) {
        return this.postService.getDetailPost(id);
    }
    createPost(createPostDto) {
        return this.postService.createPost(createPostDto);
    }
    likePost(id) {
        return this.postService.likePost(id);
    }
    addComment(id, addCommentDto) {
        return this.postService.addComment(id, addCommentDto);
    }
};
__decorate([
    Get(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PostController.prototype, "getAllPost", null);
__decorate([
    Get(':id'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PostController.prototype, "getDetailPost", null);
__decorate([
    Post(),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreatePostDto]),
    __metadata("design:returntype", void 0)
], PostController.prototype, "createPost", null);
__decorate([
    Put(':id/like'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PostController.prototype, "likePost", null);
__decorate([
    Post(':id/comment'),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, AddCommentDto]),
    __metadata("design:returntype", void 0)
], PostController.prototype, "addComment", null);
PostController = __decorate([
    Controller('post'),
    __metadata("design:paramtypes", [PostService])
], PostController);
export { PostController };
//# sourceMappingURL=post.controller.js.map