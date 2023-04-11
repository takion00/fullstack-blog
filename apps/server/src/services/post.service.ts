import { Injectable } from '@nestjs/common';
import { Post } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import { IPostService } from 'src/interfaces/post.interface';

@Injectable()
export class PostService implements IPostService {
  constructor(private prismaService: PrismaService) {}

  async createPost(authorId: string, data: Post): Promise<Post> {
    const post = this.prismaService.post.create({
      data: {
        title: data.title,
        content: data.content,
        published: data.published,
        authorId: authorId,
      },
    });

    return post;
  }

  async getAllPosts(): Promise<Post[]> {
    const posts = await this.prismaService.post.findMany({
      where: {
        published: true,
      },
    });
    return posts;
  }

  async getPostBySearch(search: string): Promise<Post[]> {
    const posts = await this.prismaService.$queryRawUnsafe(
      'SELECT * FROM "Post" WHERE "published" = $1 and "title" ILIKE $2',
      true,
      `%${search}%`,
    );
    return posts as Post[];
  }

  async getPostByAuthorId(authorId: string): Promise<Post[]> {
    const posts = await this.prismaService.$queryRawUnsafe(
      'SELECT * FROM "Post" WHERE "AuthorId" = $1',
      authorId,
    );

    return posts as Post[];
  }

  async updatePost(post: Post): Promise<Post> {
    const updatedPost = await this.prismaService.post.update({
      where: {
        id: post.id,
      },
      data: post,
    });

    return updatedPost;
  }

  async deletePost(id: string): Promise<void> {
    await this.prismaService.post.delete({
      where: {
        id,
      },
    });
  }
}
