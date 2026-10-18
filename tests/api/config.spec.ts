import { test, expect } from '@playwright/test';
import {
  deepMerge,
  hasUiCredentials,
  loadConfig,
  requireUiCredentials,
} from '../../src/config/config';

test.describe('Config loader', () => {
  test('environment variables override YAML values', () => {
    const cfg = loadConfig({ API_BASE_URL: 'https://example.test' });
    expect(cfg.api.baseUrl).toBe('https://example.test');
    expect(cfg.ui.baseUrl).toMatch(/^https:\/\//);
  });

  test('deepMerge keeps base values for undefined overrides', () => {
    const merged = deepMerge({ a: { b: 1, c: 2 } }, { a: { b: undefined, c: 3 } });
    expect(merged).toEqual({ a: { b: 1, c: 3 } });
  });

  test('credentials come only from the environment', () => {
    const cfg = loadConfig({});
    expect(hasUiCredentials(cfg)).toBe(false);
    expect(() => requireUiCredentials(cfg)).toThrow(/UI_USERNAME and UI_PASSWORD/);

    const withEnv = loadConfig({ UI_USERNAME: 'user', UI_PASSWORD: 'pass' });
    expect(requireUiCredentials(withEnv)).toEqual({ username: 'user', password: 'pass' });
  });
});
