import { Post } from '@prisma/client';
import { ErrorReturn } from 'src/types/error-return';
import { IdInToken } from 'src/types/idInToken';

export interface IPostController {
  create(body: Post & IdInToken): Promise<Post | ErrorReturn>;
  search(body: string): Promise<any>;
  getManyPosts(): Promise<Post[] | ErrorReturn>;
  update(body: Post & IdInToken): Promise<any>;
  delete(body: Post & IdInToken): Promise<any>;
}

export interface IPostService {
  createPost(authorId: string, data: Post): Promise<Post>;
  getAllPosts(): Promise<Post[]>;
  getPostBySearch(search: string): Promise<Post[]>;
  updatePost(post: Post): Promise<Post>;
  deletePost(id: string): Promise<void>;
}
