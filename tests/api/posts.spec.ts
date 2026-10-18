import { test, expect } from '../../src/fixtures';

test.describe('Posts API', () => {
  test('lists posts with the expected shape @smoke', async ({ posts }) => {
    const all = await posts.list();

    expect(all.length).toBeGreaterThan(0);
    for (const post of all.slice(0, 5)) {
      expect(post).toEqual(
        expect.objectContaining({
          id: expect.any(Number),
          userId: expect.any(Number),
          title: expect.any(String),
          body: expect.any(String),
        }),
      );
    }
  });

  test('filters posts by user', async ({ posts }) => {
    const userPosts = await posts.list({ userId: 1 });

    expect(userPosts.length).toBeGreaterThan(0);
    expect(userPosts.every((p) => p.userId === 1)).toBe(true);
  });

  test('returns a single post by id', async ({ posts }) => {
    const res = await posts.get(1);

    expect(res.status()).toBe(200);
    expect(await res.json()).toMatchObject({ id: 1, userId: 1 });
  });

  test('returns 404 for an unknown post', async ({ posts }) => {
    const res = await posts.get(999_999);
    expect(res.status()).toBe(404);
  });

  test('creates a post', async ({ posts }) => {
    const payload = { userId: 7, title: 'Showcase title', body: 'Showcase body' };
    const res = await posts.create(payload);

    expect(res.status()).toBe(201);
    expect(await res.json()).toMatchObject({ ...payload, id: expect.any(Number) });
  });

  test('updates and deletes a post', async ({ posts }) => {
    const patched = await posts.update(1, { title: 'Updated title' });
    expect(patched.status()).toBe(200);
    expect(await patched.json()).toMatchObject({ id: 1, title: 'Updated title' });

    const deleted = await posts.remove(1);
    expect(deleted.status()).toBe(200);
  });
});
