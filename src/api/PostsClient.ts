import { expect, type APIRequestContext } from '@playwright/test';

export interface Post {
  id: number;
  userId: number;
  title: string;
  body: string;
}

export type NewPost = Omit<Post, 'id'>;

/** Thin typed client over the public JSONPlaceholder /posts resource. */
export class PostsClient {
  constructor(private readonly request: APIRequestContext) {}

  async list(params?: { userId?: number }): Promise<Post[]> {
    const res = await this.request.get('posts', { params });
    expect(res.status()).toBe(200);
    return (await res.json()) as Post[];
  }

  async get(id: number) {
    return this.request.get(`posts/${id}`);
  }

  async create(post: NewPost) {
    return this.request.post('posts', { data: post });
  }

  async update(id: number, patch: Partial<NewPost>) {
    return this.request.patch(`posts/${id}`, { data: patch });
  }

  async remove(id: number) {
    return this.request.delete(`posts/${id}`);
  }
}
