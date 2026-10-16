import { Injectable, NotFoundException } from '@nestjs/common';
import { AddCommentDto, CreatePostDto } from './dto/create-post.dto.js';

export interface Post {
    id: string;
    author: string;
    title: string;
    description: string;
    like: number;
    liked: boolean;
    comment: Comment[];
}

export interface Comment  {
    author: string;
    content: string;
}

@Injectable()
export class PostService {
    private posts: Post[] = [
        {
            id: "1",
            author: "Ken",
            title: "Learning Next.js",
            description:
            "Today I am building my social Blog App with Next.js. I am learning how routing, reusable components, client components, server components, state, and user interactions work together.",
            like: 10,
            liked: false,

            comment: [
            {
                author: "Louise",
                content: "Nice post!",
            },
            {

                author: "Alex",
                content: "Keep learning Next.js.",
            },
            ],
        },

        {
            id: "2",
            author: "Louise",
            title: "Frontend Architecture",
            description:
            "I am learning how components and routes work together.",
            like: 6,
            liked: false,
            comment: [],
        },
    ];

    getAllPost() {
        return this.posts;
    }

    getDetailPost(id: string) {
        return this.posts.filter(post => post.id === id);
    }

    createPost(dto: CreatePostDto) {
        const newPost: Post = {
            id: crypto.randomUUID(),
            author: dto.author,
            title: dto.title,
            description: dto.descirption,
            like: 0,
            liked: false,
            comment: []
        }

        this.posts.push(newPost);
        return newPost;
    }

    likePost(id: string) {
        const post = this.posts.find(post => post.id === id);
        if (!post) {
            throw new NotFoundException('Post not found');
        }
        
        if (post.liked) {
            post.like -= 1;
        } else {
            post.like += 1;
        }
        post.liked = !post.liked;
        return post;
    }

    addComment(id: string, dto: AddCommentDto) {
        const post = this.posts.find(post => post.id === id);
        if (!post) {
            throw new NotFoundException('Post not found');
        }
        const newComment: Comment = {
            author: dto.author,
            content: dto.content
        }
        post.comment.push(newComment);
        return post;
    }
}
