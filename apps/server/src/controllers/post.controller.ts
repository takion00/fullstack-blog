import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { Prisma, Post as UserPost } from '@prisma/client';
import * as z from 'zod';

import { IPostController } from 'src/interfaces/post.interface';
import { PostService } from 'src/services/post.service';
import { postSchema } from 'src/utils/validator';
import { IdInToken } from 'src/types/idInToken';

@Controller('post')
export class PostController implements IPostController {
  constructor(private postService: PostService) {}

  // This controller is used to create a post
  @Post()
  async create(@Body() body: UserPost & IdInToken) {
    try {
      const authorId = body.idInToken;
      body.authorId = authorId;
      postSchema.parse(body);

      const post = await this.postService.createPost(authorId, body);

      return post;
    } catch (err) {
      if (err instanceof z.ZodError) {
        return {
          errors: err.issues.map((error) => error.message),
        };
      }

      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        return {
          errors: [err.message],
        };
      }

      return {
        errors: [err.message],
      };
    }
  }

  @Get(':search')
  async search(@Param('search') search: string) {
    try {
      const posts = this.postService.getPostBySearch(search);
      return posts;
    } catch (err) {
      return {
        errors: [err.message],
      };
    }
  }

  @Get()
  async getManyPosts() {
    try {
      const posts = await this.postService.getAllPosts();

      return posts;
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        return {
          errors: [err.meta.cause],
        };
      }
    }
  }

  @Get('myposts')
  async getByAuthorId(@Body() body: IdInToken) {
    try {
      if (!body.idInToken) {
        return {
          error: 'Invalid request',
        };
      }

      const posts = await this.postService.getPostByAuthorId(body.idInToken);

      return posts;
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        return {
          errors: [err.meta.cause],
        };
      }

      if (err instanceof Error) {
        return {
          errors: [err.message],
        };
      }

      return { errors: [err.message] };
    }
  }

  @Put()
  async update(@Body() body: UserPost & IdInToken) {
    const partialPostSchema = postSchema.partial();
    try {
      const authorId = body.idInToken;

      if (authorId !== body.authorId) {
        throw new Error('not authorized to edit the post');
      }

      delete body.idInToken;

      partialPostSchema.parse(body);

      await this.postService.updatePost(body);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return {
          errors: err.issues.map((error) => error.message),
        };
      }

      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        return {
          errors: [err.meta.cause],
        };
      }

      console.log(err);
      return {
        errors: [err.message],
      };
    }
  }

  @Delete()
  async delete(@Body() body: UserPost & IdInToken) {
    try {
      const authorId = body.idInToken;

      if (authorId !== body.authorId) {
        return {
          errors: [`not authorized to delete`],
        };
      }

      await this.postService.deletePost(body.id);

      return {
        message: 'Deleted successfully',
      };
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        return {
          errors: [err.meta.cause],
        };
      }

      return {
        errors: [err.message],
      };
    }
  }
}
