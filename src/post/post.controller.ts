import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { PostService } from './post.service.js';
import { AddCommentDto, CreatePostDto } from './dto/create-post.dto.js';

@Controller('post')
export class PostController {
    constructor(private readonly postService: PostService) {}

    @Get()
    getAllPost() {
        return this.postService.getAllPost();
    }

    @Get(':id')
    getDetailPost(@Param('id') id: string) {
        return this.postService.getDetailPost(id);
    }

    @Post()
    createPost(@Body() createPostDto: CreatePostDto) {
        return this.postService.createPost(createPostDto);
    }

    @Put(':id/like')
    likePost(@Param('id') id: string) {
        return this.postService.likePost(id);
    }

    @Post(':id/comment')
    addComment(@Param('id') id: string, @Body() addCommentDto: AddCommentDto) {
        return this.postService.addComment(id, addCommentDto);
    }
    
}
